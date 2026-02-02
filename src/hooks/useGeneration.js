// n8n Integration Hook for Virtual Set Preview Generator
// Connects React frontend to n8n webhook endpoints

const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://meltingprovince.app.n8n.cloud/webhook';

/**
 * Submit a brief to n8n for processing
 * @param {Object} formData - The brief form data
 * @returns {Promise<{jobId: string, status: string}>}
 */
export async function submitBrief(formData) {
  const response = await fetch(`${N8N_BASE_URL}/brief-submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      showType: formData.showTypeCustom || formData.showType,
      mood: formData.mood,
      moodNotes: formData.moodNotes,
      colorPreset: formData.colorPreset,
      elements: formData.elements,
      elementNotes: formData.elementNotes,
      referenceUrls: formData.referenceUrls,
      additionalNotes: formData.additionalNotes,
      outputType: 'images', // or 'video'
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit brief: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check the status of a generation job
 * @param {string} jobId - The job ID to check
 * @returns {Promise<{jobId: string, status: string, stage: string, progress: number}>}
 */
export async function checkJobStatus(jobId) {
  const response = await fetch(`${N8N_BASE_URL}/job-status/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the results of a completed job
 * @param {string} jobId - The job ID to get results for
 * @returns {Promise<{jobId: string, outputs: Object, prompts: Object}>}
 */
export async function getJobResults(jobId) {
  const response = await fetch(`${N8N_BASE_URL}/job-result/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get results: ${response.statusText}`);
  }

  return response.json();
}

/**
 * React hook for managing generation state
 */
import { useState, useEffect, useCallback } from 'react';

export function useGeneration() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Submit brief and start generation
  const startGeneration = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await submitBrief(formData);
      setJobId(response.jobId);
      setStatus({ status: 'queued', progress: 0 });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (!jobId) return;
    if (status?.status === 'complete' || status?.status === 'failed') return;

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await checkJobStatus(jobId);
        setStatus(statusResponse);

        if (statusResponse.status === 'complete') {
          const resultsResponse = await getJobResults(jobId);
          setResults(resultsResponse);
          clearInterval(pollInterval);
        } else if (statusResponse.status === 'failed') {
          setError('Generation failed');
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Status poll error:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId, status?.status]);

  // Reset state
  const reset = useCallback(() => {
    setJobId(null);
    setStatus(null);
    setResults(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    jobId,
    status,
    results,
    error,
    isLoading,
    startGeneration,
    reset,
    // Computed values
    progress: status?.progress || 0,
    stage: status?.stage || null,
    isProcessing: !!jobId && status?.status !== 'complete' && status?.status !== 'failed',
    isComplete: status?.status === 'complete',
    isFailed: status?.status === 'failed',
  };
}

export default useGeneration;
