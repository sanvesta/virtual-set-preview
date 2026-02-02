// n8n Integration Hook for Virtual Set Preview Generator
// Sends initData for Telegram validation - secure, no exposed API keys

import { useState, useEffect, useCallback } from 'react'

const N8N_WEBHOOK_URL = 'https://meltingprovince.app.n8n.cloud/webhook/brief-submit'

/**
 * Submit a brief to n8n with Telegram initData for validation
 * @param {Object} formData - The brief form data
 * @param {string} initData - Telegram initData string (signed by Telegram)
 * @returns {Promise<{jobId: string, status: string}>}
 */
export async function submitBrief(formData, initData) {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Telegram auth (validated server-side with bot token)
      initData: initData,
      
      // Brief data
      brief: {
        showType: formData.showTypeCustom || formData.showType,
        mood: formData.mood,
        moodNotes: formData.moodNotes,
        colorPreset: formData.colorPreset,
        elements: formData.elements,
        elementNotes: formData.elementNotes,
        referenceUrls: formData.referenceUrls,
        additionalNotes: formData.additionalNotes,
      },
      
      // Metadata
      outputType: 'images',
      timestamp: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `Request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * React hook for managing generation state
 * @param {string} initData - Telegram initData for auth
 */
export function useGeneration(initData) {
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Submit brief and start generation
  const startGeneration = useCallback(async (formData) => {
    setIsLoading(true)
    setError(null)
    setResults(null)
    
    try {
      const response = await submitBrief(formData, initData)
      setJobId(response.jobId)
      setStatus({ status: 'processing', progress: 0 })
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [initData])

  // Poll for status (simplified - n8n will send results via Telegram bot)
  useEffect(() => {
    if (!jobId || !status) return
    if (status.status === 'complete' || status.status === 'failed') return

    // For Telegram Mini App, n8n sends results back via bot message
    // This polling is optional/backup
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `https://meltingprovince.app.n8n.cloud/webhook/job-status/${jobId}`,
          {
            headers: { 'X-Init-Data': initData }
          }
        )
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
          if (data.status === 'complete') {
            setResults(data.outputs)
          }
        }
      } catch (err) {
        console.error('Status check failed:', err)
      }
    }

    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [jobId, status, initData])

  // Reset state
  const reset = useCallback(() => {
    setJobId(null)
    setStatus(null)
    setResults(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    jobId,
    status,
    results,
    error,
    isLoading,
    startGeneration,
    reset,
    // Computed
    progress: status?.progress || 0,
    stage: status?.stage || null,
    isProcessing: !!jobId && status?.status === 'processing',
    isComplete: status?.status === 'complete',
    isFailed: status?.status === 'failed',
  }
}

export default useGeneration
