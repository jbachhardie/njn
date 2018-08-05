/**
 * The core functions behind njn, designed to be used by the different
 * adapters/implementations although they can also be imported directly.
 */

/**
 * Take actions from an iterator and feed them to a driver, returning
 * the responses to the iterator. This allows async control flow to
 * be expressed as a synchronous iterator.
 */
export async function drive<Action, Response>(
  iter: Iterator<Action>,
  driver: (action: Action) => Response
): Promise<Response | undefined> {
  let done, value, response
  while (!done) {
    ;({ done, value } = iter.next(response))
    if (value) response = await driver(value)
  }
  return response
}
