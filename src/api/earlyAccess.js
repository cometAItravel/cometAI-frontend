/* global globalThis */
const REQUEST_TIMEOUT_MS = 45000;

class SubmissionError extends Error {}

export async function submitEarlyAccess(form, {
  signal,
  endpoint = "/api/early-access",
  timeoutMs = REQUEST_TIMEOUT_MS,
  fetchImpl = globalThis.fetch,
} = {}) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  let timedOut = false;

  if (signal?.aborted) {
    throw new DOMException("Request cancelled", "AbortError");
  }
  signal?.addEventListener("abort", cancel, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      signal: controller.signal,
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      data = null;
    }

    if (!response.ok) {
      const message = response.status >= 400 && response.status < 500 && typeof data?.message === "string"
        ? data.message
        : "Something went wrong. Please try again in a moment.";
      throw new SubmissionError(message);
    }
    if (data?.received !== true) {
      throw new SubmissionError("We couldn't confirm whether your request was received. Please contact the Alvryn team before submitting again.");
    }
    return data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timedOut) {
      throw new SubmissionError("The request timed out. We couldn't confirm whether it was received. Please contact the Alvryn team before submitting again.");
    }
    if (error instanceof SubmissionError) throw error;
    throw new SubmissionError("Could not confirm receipt. Contact Alvryn before submitting again if the request may have reached the server.");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", cancel);
  }
}
