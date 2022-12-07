/**
 * Applies a given callback to all current and future elements matching the css selector.
 * @param {string} selector The observer searches for elements matching this css selector.
 * @param {(node: HTMLElement) => any} callback This callback is called for each new matching element that appears. (Callback is not awaited.)
 * @param {boolean} current Whether to check already existing elements too (or only future ones).
 * @param {Node} parent Node whose children are observed. Defaults to the document body.
 * @returns {() => void} Method to disconnect the observer.
 */
export function queryObserverAll(selector, callback, current = true, parent = document.body) {
    if (current) {
        const nodes = document.querySelectorAll(selector)
        for (const node of nodes)
            callback(node)
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations)
            if (mutation.addedNodes)
                for (const node of mutation.addedNodes)
                    if (node instanceof Element) {
                        const children = node.querySelectorAll(selector)
                        if (node.matches(selector))
                            callback(node)
                        for (const child of children)
                            callback(child)
                    }
    })

    observer.observe(parent, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false
    })

    return () => observer.disconnect()
}

/**
 * Applies a given callback to the first element matching the css selector.
 * @param {string} selector The observer searches for an element matching this css selector.
 * @param {(node: HTMLElement) => any} callback This callback is called when a matching element is found.
 * @param {boolean} current Whether to check already existing elements too (or only future ones).
 * @param {Node} parent Node whose children are observed. Defaults to the document body.
 * @returns {() => void} Method to disconnect the observer. (Automatically disconnects once the element is found.)
 */
export function queryObserver(selector, callback, current = true, parent = document.body) {
    if (current) {
        const node = document.querySelector(selector)
        if (node) {
            callback(node)
            return () => { }
        }
    }

    let found = false

    const observer = new MutationObserver(mutations => {
        if (!found)
            outer: for (const mutation of mutations)
                if (mutation.addedNodes)
                    for (const node of mutation.addedNodes)
                        if (node instanceof Element) {
                            if (node.matches(selector)) {
                                found = true
                                observer.disconnect()
                                callback(node)
                                break outer
                            }

                            const child = node.querySelector(selector)

                            if (child) {
                                found = true
                                observer.disconnect()
                                callback(child)
                                break outer
                            }
                        }
    })

    observer.observe(parent, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false
    })

    return () => observer.disconnect()
}