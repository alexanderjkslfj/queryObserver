/**
 * Applies a given callback to all current and future elements matching the css selector.
 * @param {string} selector The observer searches for elements matching this css selector.
 * @param {(node: HTMLElement) => any} callback This callback is called for each matching element found. (Callback is not awaited.)
 * @param {boolean} current Whether to check already existing elements too (or only future ones).
 * @param {Node} parent Node whose children are observed. Defaults to the document body.
 * @returns {() => void} Method to disconnect the observer.
 */
export function queryObserverAll(selector, callback, current = true, parent = document.body) {

    // This code checks existing nodes. It is therefore dependent on the "current" parameter.
    if (current) {
        // Get all existing nodes matching the selector.
        const nodes = document.querySelectorAll(selector)

        // Execute callback for each existing node.
        for (const node of nodes)
            callback(node)
    }

    // create the mutation observer
    const observer = new MutationObserver(mutations => {
        // iterate over the mutations
        for (const mutation of mutations)
            // check if the current mutation includes adding nodes
            if (mutation.addedNodes)
                // iterate over the added nodes
                for (const node of mutation.addedNodes)
                    // check if node is an element
                    if (node instanceof Element) {
                        // Get matching children of node added. (If a node already has children when it's added, the children don't dispatch a mutation event.)
                        const children = node.querySelectorAll(selector)

                        // Execute callback for node if it matches the selector
                        if (node.matches(selector))
                            callback(node)

                        // Execute callback for matching children of node
                        for (const child of children)
                            callback(child)
                    }
    })

    // start the observer
    observer.observe(parent, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false
    })

    // returns a method to disconnect the observer
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

    // This code checks existing nodes. It is therefore dependent on the "current" parameter.
    if (current) {
        // Checks if a matching node already exists.
        const node = document.querySelector(selector)

        // If a matching node exists, execute the callback and return an empty method.
        if (node) {
            callback(node)
            return () => { }
        }
    }

    /**
     * Whether a matching node has already been found; If so, no more callbacks shall be called.
     * @type {boolean}
     */
    let found = false

    const observer = new MutationObserver(mutations => {
        // Don't do anything if a matching node has already been found.
        if (!found)
            // iterate over the mutations
            outer: for (const mutation of mutations)
                // check if the current mutation includes adding nodes
                if (mutation.addedNodes)
                    // iterate over the added nodes
                    for (const node of mutation.addedNodes)
                        // check if node is an element
                        if (node instanceof Element) {
                            // if the node is matching
                            if (node.matches(selector)) {
                                // ensure no more mutations are processed
                                found = true
                                // stop the observer from observing more mutations
                                observer.disconnect()
                                // call the callback for the matching node
                                callback(node)
                                // stop iteration over the currently viewed mutations
                                break outer
                            }

                            // check if the node has a matching child
                            const child = node.querySelector(selector)

                            // if the node has a matching child
                            if (child) {
                                // ensure no more mutations are processed
                                found = true
                                // stop the observer from observing more mutations
                                observer.disconnect()
                                // call the callback for the matching node
                                callback(child)
                                // stop iteration over the currently viewed mutations
                                break outer
                            }
                        }
    })

    // start the observer
    observer.observe(parent, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false
    })

    // returns a method to disconnect the observer
    return () => observer.disconnect()
}