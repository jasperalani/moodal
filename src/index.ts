(() => {
    // Define types for configuration
    type MoodalOptions = {
        content: string;
        closable?: boolean;
    };

    class Moodal { 
        private container: HTMLElement;
        private options: MoodalOptions;

        constructor(options: MoodalOptions) {
            this.options = {
                closable: true,
                ...options 
            };
            this.container = this.createModal();
        }

        private createModal(): HTMLElement {
            const modal = document.createElement("div");
            modal.classList.add("moodal-overlay");

            const box = document.createElement("div");
            box.classList.add("moodal-box");
            box.innerHTML = this.options.content;

            if (this.options.closable) {
                const closeBtn = document.createElement("button");
                closeBtn.innerText = "×";
                closeBtn.classList.add("moodal-close");
                closeBtn.addEventListener("click", () => this.close());
                box.appendChild(closeBtn);
            }

            modal.appendChild(box);
            return modal;
        }

        public open(): void {
            document.body.appendChild(this.container);
        }

        public close(): void {
            if (this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
    }

    // Export to window for global usage
    (window as any).Moodal = Moodal;
})();
 