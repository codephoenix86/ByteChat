/**
 * Wrapper for async route handlers
 * Catches errors and passes them to error handling middleware
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Express middleware function
 */
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}