class Moostatic {
    static instance: Moostatic = this;

    constructor() {
        return this;
    }

    static getInstance() { 
        if (!Moostatic.instance) {
            Moostatic.instance = new Moostatic();
        }
        return Moostatic.instance;
    }

    static randomCharString(...options: { length: number }[]): string {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (const opt of options) {
            for (let i = 0; i < opt.length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
        }

        return result;  
    }

    static newElement(insertIntoDOM: boolean = false): HTMLElement {
        let element = document.createElement("div");
        const rtitle: string = Moostatic.randomCharString({ length: 6 });
        const rtext: string = Moostatic.randomCharString({ length: 24 });
        element.classList.add("auto-generated", rtitle);
        element.innerHTML = rtext;

        if (insertIntoDOM) {
            const vdom = new MooDOM(document);
            const injection = vdom.insert(element);
            console.log("injection: ", injection)
            // const injectedElement = Array.isArray(injection) ? injection[injection.length - 1] : injection;
            // // dont extract
            // const extractedElement = vdom.fetch(injectedElement, { elementExistance: false, elementSelf: true });
            // console.log(extractedElement);
            // console.log("Inserted element into DOM:", injectedElement);
        }

        return element;
    }

    static benchmark(label: string, fn: () => void, iterations: number = 1000): void {
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

    static domToJson(node: any): any {
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
                obj.children = Array.from(node.childNodes).map(Moostatic.domToJson);
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
}

class MooDOM {
    private documentRoot: Document;
    private root: HTMLElement;
    private flattenedDOMSet: Set<HTMLElement> = new Set();
    private injectionArray: HTMLElement[] = [];


    public constructor(Document: Document) {
        this.documentRoot = Document;
        this.root = this.documentRoot.body;
        this.flattenDOM(this.root);
        return this;
    }

    get getRoot(): HTMLElement {
        return this.root;
    }

    get getDocument(): Document {
        return this.documentRoot;
    }

    private get getFlattenedDOMSet(): Set<HTMLElement> {
        return this.flattenedDOMSet;
    }

    set appendFlattenedDOMSet(value: HTMLElement) {
        this.flattenedDOMSet.add(value);
    }

    public insert(elements: HTMLElement | HTMLElement[],
        options: { insertDuplicate: boolean, cloneDescendants: boolean } = { insertDuplicate: true, cloneDescendants: true }
    ): HTMLElement | HTMLElement[] {
        // Ensure we're dealing with an array
        elements = Array.isArray(elements) ? elements : [elements]

        // Only insert unique elements - if false OR (null or undefined)
        if (!options.insertDuplicate || (options.insertDuplicate ?? true)) {
            this.getRoot.after(...elements);
            return elements;
        }

        for (const el of elements) { this.getRoot.appendChild(el.cloneNode(!!options.cloneDescendants)); }
        return elements;                                         // set true if somehow set to null or undefined 
    }

    public remove(element: HTMLElement): void {
        // this problably doesnt work
        if (this.getRoot.contains(element)) {
            this.getRoot.removeChild(element);
        } else {
            throw new Error("Element not found in the DOM");
        }
    }

    public fetch(
        element: HTMLElement,
        returnOptions: {
            elementExistance?: boolean;
            elementSelf?: boolean | Element;
        }
    ): {
        elementExists?: boolean;
        self?: boolean | Element;
    } {
        const result = this.getFlattenedDOMSet.has(element) ? element : false;
        let response: { elementExists?: boolean; self?: boolean | Element } = {
            elementExists: false,
            self: false,
        };

        if (returnOptions.elementExistance) {
            response.elementExists = result !== false;
        } else if (returnOptions.elementSelf) {
            response.self = result !== false ? result : false;
        }

        return response;
    }

    private flattenDOM(
        abstractRange: HTMLElement | HTMLElement[] = this.root
    ): Set<HTMLElement> {
        const elements = Array.isArray(abstractRange)
            ? abstractRange
            : [abstractRange];

        for (const el of elements) {
            this.appendFlattenedDOMSet = el;
            if (el.children.length > 0) {
                this.flattenDOM(Array.from(el.children) as HTMLElement[]);
            }
        }

        if (this.getFlattenedDOMSet.size === 0) {
            throw new Error("No elements found in the DOM");
        }

        return this.flattenedDOMSet;
    }
}

type MoodalOptions = {
    content: string;         // Required HTML content to display inside the modal
    closable?: boolean;      // Optional: whether the modal has a close button (default: true)
};
 
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

// UMD-style global export
if (typeof window !== "undefined") {
    (window as any).Moodal = Moodal;
    (window as any).MooDOM = MooDOM;
    (window as any).Moostatic = Moostatic;
}
 
// ESM export
export {
    Moodal,
    MooDOM, 
    Moostatic
}
