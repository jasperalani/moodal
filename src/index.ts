// Immediately Invoked Function Expression (IIFE) to encapsulate the library and avoid polluting the global scope
(() => {
    // Define the type for configuration options that can be passed to the Moodal constructor
    type MoodalOptions = {
        content: string;         // Required HTML content to display inside the modal
        closable?: boolean;      // Optional: whether the modal has a close button (default: true)
    };

    // MoodalDOM class for managing the modal's DOM structure
    class MoodalDOM {
        private entry: HTMLElement;
        private flattenedDOMSet: Set<HTMLElement> = new Set();
        private injectionArray: HTMLElement[] = [];                                    // Container for holding the modal's content
        private injectionContainer: HTMLDivElement = document.createElement("div");             // Container for holding the modal's content

        constructor(options: MoodalOptions) {
            // Select the root element for modal injection
            this.entry = document.querySelector("body") as HTMLBodyElement;
            this.resetInjectionData();
        }

        private resetInjectionData(): void {
            this.flattenedDOMSet = new Set();
            this.injectionArray = [];
            this.injectionContainer = document.createElement("div");
        }

        public existsFast(element: HTMLElement): {el: HTMLElement, found: boolean} {
            let found = false;
            this.resetInjectionData();
            this.flatten();
            if (this.flattenedDOMSet.size === 0) {
                throw new Error("No elements found in the DOM");
            }
            return this.flattenedDOMSet.has(element) ? {el: element, found: true} : {el: element, found: false};
        }

        public existsSlow(element: HTMLElement): {el: HTMLElement, found: boolean} {
            let found = false;
            this.resetInjectionData();
            this.flatten();
            if (this.flattenedDOMSet.size === 0) {
                throw new Error("No elements found in the DOM");
            }
            this.flattenedDOMSet.forEach((el) => {
                if (
                    el.outerHTML === element.outerHTML && // compare full element html
                    el.className === element.className && // contains class names
                    el.localName === element.localName    // compare element types (div, span, etc.)
                ) {
                    found = true;
                }
            });

            return {el: element, found: found};
        }

        /* Populates this.flattenedDOM */
        public flatten(root: HTMLElement | HTMLElement[] = this.entry): void {
            const elements = Array.isArray(root) ? root : [root];

            for (const el of elements) {
                this.flattenedDOMSet.add(el); // Push current element
                if (el.children.length > 0) {
                    this.flatten(Array.from(el.children) as HTMLElement[]);
                }
            }

        }

        public insert(elements: HTMLElement | HTMLElement[], options: { insertDuplicate?: boolean } = { insertDuplicate: true }): void {
            this.resetInjectionData();

            // Ensure we're dealing with an array
            !Array.isArray(elements) ? this.injectionArray.push(elements) : this.injectionArray.push(...elements);

            switch (options.insertDuplicate) {
                case false:
                    this.entry.after(...this.injectionArray);
                    break;
                default:
                case true:
                    for (const element of this.injectionArray) {
                        this.entry.appendChild(element.cloneNode(true));
                    }
                    break;
            }
        }

        public remove(element: HTMLElement): void {
            console.log(this.entry.removeChild(element));

            // Remove the modal from the DOM
            // if (this.entry.parentNode) {
            //     this.entry.parentNode.removeChild(this.entry);
            // }
        }


        // public flatExists1(search: HTMLElement | HTMLElement[] = new Array): any {
        //     let arrayInUse: HTMLElement[] | HTMLCollection[] = [];
        //     if (this.flatExistCounter === 0) {
        //         arrayInUse = Array.isArray(this.entry.children) ? Array.from(this.entry.children) as HTMLElement[] : [...this.entry.children] as HTMLElement[];
        //     } else {
        //         arrayInUse = Array.isArray(search) ? search : [search] as HTMLElement[];
        //     }

        //     for (const item of arrayInUse) {
        //         if (item.hasChildNodes()) {
        //             return this.flatExists(Array.prototype.slice.call(item.children));
        //         } else {
        //             // console.log("item", item)
        //             this.flatElements.push(item as HTMLElement);
        //             return false;
        //         }
        //         return true;
        //     }

        //     this.flatExistCounter++;



        //     console.log("arrayInUse", arrayInUse)
        //     console.log("flatElements", this.flatElements)

        //     // this.flatExistCounter++;
        //     //                         console.log("this.flatElements: ", this.flatElements)
        //     // return

        //     //             !Array.isArray(this.flatElements) ? this.flatElements = [...this.flatElements] as HTMLElement[] 
        //     //             : this.flatElements.length <= 0 ? this.flatElements = [...this.flatElements] as HTMLElement[] : this.flatElements;

        //     //             const flatDOM = this.flatElements.flat();
        //     //             console.log(flatDOM)

        // }


        // public exists1(compare: HTMLElement, search: HTMLElement | HTMLElement[] = new Array): any {
        //     // Do this second incase $search is equal to what we are looking for
        //     !Array.isArray(search) ? search = [...this.entry.children] as HTMLElement[] : search.length <= 0 ? search = [...this.entry.children] as HTMLElement[] : search;

        //     c(search)
        //     c(this.entry.children)

        //     for (const child of search) {
        //         if (!(child instanceof HTMLElement)) {
        //             throw new Error(
        //                 `Expected child to be an HTMLElement, was ${child && child.constructor && child.constructor.name || child}`
        //             );
        //         }

        //         // Recursively check if the child contains the compare element
        //         if (child as HTMLElement === compare as HTMLElement) {
        //             return true;
        //         } else if (child.contains(compare)) {
        //             return this.exists(compare, child);
        //         } else {
        //             return false;
        //         }
        //     }

        // }
    }

    // Moodal class encapsulates all logic for creating, opening, and closing a modal
    class Moodal {
        private entry: HTMLElement;          // Entry point for injecting HTML content
        // private container: HTMLElement;      // Holds the modal DOM structure
        private options: MoodalOptions;      // Stores user-provided configuration options

        constructor(options: MoodalOptions) {
            // Select the root element for modal injection
            this.entry = document.querySelector(".root") as HTMLElement;
            // Merge default options with user-provided ones
            this.options = {
                closable: true,              // Default to closable unless explicitly set to false
                ...options                   // Override defaults with user options
            };
            // Create the modal DOM element during construction
            // this.container = this.createModal();
        }

        // Private method to build and return the modal DOM structure
        // private createModal(): HTMLElement {
        //     // Outer overlay element that dims the background
        //     const modal = document.createElement("div").id = "moo__dal"
        //     // todo: title optional to be h1 or h2 
        //     const modalTitle = document.createElement("h2");

        //     // modal.classList.add("moodal-overlay");

        //     // Inner content box of the modal
        //     const modalBody = document.createElement("div");
        //     modalBody.classList.add("moodal__body");
        //     box.innerHTML = this.options.content;

        //     // If the modal is closable, add a close button
        //     if (this.options.closable) {
        //         const closeBtn = document.createElement("button");
        //         closeBtn.innerText = "×";
        //         closeBtn.classList.add("moodal-close");
        //         // When clicked, the modal will be removed from the DOM
        //         closeBtn.addEventListener("click", () => this.close());
        //         box.appendChild(closeBtn);
        //     }

        //     // Assemble the modal structure
        //     modal.appendChild(box);
        //     return modal;
        // }

        // // Public method to insert the modal into the DOM and display it
        // public open(): void {
        //     document.body.appendChild(this.container);
        // }

        // // Public method to remove the modal from the DOM
        // public close(): void {
        //     if (this.container.parentNode) {
        //         this.container.parentNode.removeChild(this.container);
        //     }
        // }
    }

    // Expose the Moodal class to the global `window` object for use in browser environments
    (window as any).Moodal = Moodal;
    (window as any).MoodalDOM = MoodalDOM;
})();


function c(a) {
    console.log(a);
}

function domToJson(node: any): any {
    const obj: { className: string, innerHTML: string, text: string; comment: string; nodeType: number; nodeName: string; tag: string; attributes: any[]; children: any[] }
        = { className: "", innerHTML: "", text: "", comment: "", nodeType: node.nodeType, nodeName: node.nodeName, tag: "", attributes: [], children: [] };


    if (node.nodeType === Node.ELEMENT_NODE) {
        obj.tag = node.tagName.toLowerCase();
        obj.className = node.className || ""; // className is not always present
        // obj.innerHTML = node.innerHTML || ""; // innerHTML is not always present

        // attributes
        if (node.attributes.length) {
            obj.attributes = [];
            for (let attr of node.attributes) {
                obj.attributes[attr.name] = attr.value;
            }
        }

        // children
        if (node.childNodes.length) {
            obj.children = Array.from(node.childNodes).map(domToJson);
        }
    }
    else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (text) obj.text = text;          // skip pure-whitespace
    }
    else if (node.nodeType === Node.COMMENT_NODE) {
        obj.comment = node.nodeValue;
    }

    return obj;
}

function benchmark(label: string, fn: () => void, iterations: number = 1000): void {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        fn();
    }

    const end = performance.now();
    const total = end - start;
    const average = total / iterations;

    console.log(`${label} ran ${iterations} times`);
    console.log(`→ Total time: ${total.toFixed(2)}ms`);
    console.log(`→ Average time: ${average.toFixed(4)}ms per call`);
}
