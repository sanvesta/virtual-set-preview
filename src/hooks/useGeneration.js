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
 * @returns {Promise<{jobId: string, status: string, progress: number, stage: string}>}
 */
export async function checkJobStatus(jobId) {
  const response = await fetch(`${N8N_BASE_URL}/job-status/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check job status: ${response.statusText}`);
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
    throw new Error(`Failed to get job results: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit a revision request
 * @param {string} jobId - The original job ID
 * @param {Object} revision - The revision details
 * @returns {Promise<{jobId: string, status: string}>}
 */
export async function submitRevision(jobId, revision) {
  const response = await fetch(`${N8N_BASE_URL}/brief-revision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalJobId: jobId,
      fixes: revision.fixes,
      notes: revision.notes,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit revision: ${response.statusText}`);
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
  const [isPolling, setIsPolling] = useState(false);

  // Submit brief and start generation
  const startGeneration = useCallback(async (formData) => {
    setError(null);
    setResults(null);
    
    try {
      const response = await submitBrief(formData);
      setJobId(response.jobId);
      setStatus({ status: 'queued', progress: 0 });
      setIsPolling(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (!jobId || !isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await checkJobStatus(jobId);
        setStatus(statusResponse);

        if (statusResponse.status === 'complete') {
          setIsPolling(false);
          const resultsResponse = await getJobResults(jobId);
          setResults(resultsResponse);
        } else if (statusResponse.status === 'failed') {
          setIsPolling(false);
          setError('Generation failed. Please try again.');
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Don't stop polling on transient errors
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId, isPolling]);

  // Submit revision
  const requestRevision = useCallback(async (revision) => {
    if (!jobId) return;
    
    setError(null);
    setResults(null);
    
    try {
      const response = await submitRevision(jobId, revision);
      setJobId(response.jobId);
      setStatus({ status: 'queued', progress: 0 });
      setIsPolling(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [jobId]);

  // Reset state
  const reset = useCallback(() => {
    setJobId(null);
    setStatus(null);
    setResults(null);
    setError(null);
    setIsPolling(false);
  }, []);

  return {
    jobId,
    status,
    results,
    error,
    isProcessing: isPolling,
    startGeneration,
    requestRevision,
    reset,
  };
}

export default useGeneration;
