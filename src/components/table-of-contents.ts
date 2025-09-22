// TypeScript interfaces and types for Table of Contents component
interface HeadingData {
  id: string;
  text: string;
  level: number;
  element: HTMLHeadingElement;
}

interface NumberingState {
  level1: number; // h1, h2, h3
  level2: number; // h4, h5, h6
}

interface TableOfContentsElement extends HTMLElement {
  headings: HeadingData[];
  observer: IntersectionObserver | null;
  isOpen: boolean;
  numbering: NumberingState;
  scrollOffset: number;
}

class TableOfContentsElement extends HTMLElement {
  public headings: HeadingData[] = [];
  public observer: IntersectionObserver | null = null;
  public isOpen: boolean = false;
  public scrollOffset: number = 120; // Default offset for sticky headers
  public numbering: NumberingState = {
    level1: 0, // h1, h2, h3
    level2: 0  // h4, h5, h6
  };

  constructor() {
    super();
  }

  connectedCallback(): void {
    // Wait for content to be loaded
    setTimeout(() => {
      this.init();
    }, 100);
  }

  disconnectedCallback(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private init(): void {
    const content = this.querySelector('[data-toc-content]') as HTMLElement;
    const nav = this.querySelector('[data-toc-nav]') as HTMLElement;
    const toggle = this.querySelector('[data-toc-toggle]') as HTMLElement;

    if (!content || !nav) return;

    // Get custom scroll offset from data attribute
    const customOffset = this.getAttribute('data-scroll-offset');
    if (customOffset) {
      this.scrollOffset = parseInt(customOffset, 10) || 120;
    }

    this.extractHeadings(content);
    this.generateTOC(nav);
    this.setupScrollSpy();
    this.setupSmoothScrolling(nav);
    this.setupMobileToggle(toggle, nav);
  }

  private extractHeadings(content: HTMLElement): void {
    const headingSelectors = 'h1, h2, h3, h4, h5, h6';
    const headingElements = content.querySelectorAll(headingSelectors) as NodeListOf<HTMLHeadingElement>;

    this.headings = Array.from(headingElements).map((heading: HTMLHeadingElement): HeadingData => {
      const id = this.generateId(heading.textContent || '');
      heading.id = id;

      // Map h1,h2,h3 to level 1, h4,h5,h6 to level 2
      const originalLevel = parseInt(heading.tagName.charAt(1), 10);
      const mappedLevel = originalLevel <= 3 ? 1 : 2;

      return {
        id,
        text: heading.textContent?.trim() || '',
        level: mappedLevel,
        element: heading
      };
    });
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateNumber(level: number): string {
    // Reset counters for levels below current level
    if (level === 1) {
      this.numbering.level2 = 0; // Reset level 2 when we encounter level 1
    }

    // Increment current level counter
    if (level === 1) {
      this.numbering.level1++;
    } else if (level === 2) {
      this.numbering.level2++;
    }

    // Generate hierarchical number
    let number = '';
    if (this.numbering.level1 > 0) {
      number += this.numbering.level1;
    }
    if (level === 2 && this.numbering.level2 > 0) {
      if (number) number += '.';
      number += this.numbering.level2;
    }

    return number;
  }

  private generateTOC(nav: HTMLElement): void {
    const ul = document.createElement('ul');
    let currentLevel1: HeadingData | null = null;
    let currentLevel1List: HTMLUListElement | null = null;

    this.headings.forEach((heading: HeadingData) => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.href = `#${heading.id}`;

      // Generate number for this heading
      const number = this.generateNumber(heading.level);
      a.textContent = `${number}. ${heading.text}`;
      a.className = `level-${heading.level}`;

      li.appendChild(a);

      if (heading.level === 1) {
        // Level 1 headings (h1, h2, h3) are top-level parents
        currentLevel1 = heading;
        currentLevel1List = ul;
        currentLevel1List.appendChild(li);
      } else {
        // Level 2 headings (h4, h5, h6) are children of the current level 1
        if (currentLevel1List && currentLevel1) {
          // Check if we need to create a nested list for the current level 1
          let nestedUl = currentLevel1List.querySelector(`li:has(a[href="#${currentLevel1.id}"]) ul`) as HTMLUListElement;
          if (!nestedUl) {
            // Create nested ul for the current level 1
            const level1Li = currentLevel1List.querySelector(`li:has(a[href="#${currentLevel1.id}"])`) as HTMLLIElement;
            if (level1Li) {
              nestedUl = document.createElement('ul');
              level1Li.appendChild(nestedUl);
            }
          }

          if (nestedUl) {
            nestedUl.appendChild(li);
          } else {
            // Fallback: add to main list if something went wrong
            currentLevel1List.appendChild(li);
          }
        } else {
          // Fallback: add to main list if no level 1 found yet
          currentLevel1List = ul;
          currentLevel1List.appendChild(li);
        }
      }
    });

    nav.appendChild(ul);
  }

  private setupScrollSpy(): void {
    // Use scroll event instead of IntersectionObserver for more precise control
    let ticking = false;

    const updateActiveSection = (): void => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      let activeHeading: HeadingData | null = null;

      // Find the heading that's closest to the top of the viewport
      for (let i = this.headings.length - 1; i >= 0; i--) {
        const heading = this.headings[i];
        const headingTop = heading.element.offsetTop;

        // Check if heading is at or near the top of the viewport
        // Use configurable offset to account for sticky headers or padding
        if (headingTop <= scrollTop + this.scrollOffset) {
          activeHeading = heading;
          break;
        }
      }

      // If no heading is found (scrolled past all content), use the last heading
      if (!activeHeading && this.headings.length > 0) {
        activeHeading = this.headings[this.headings.length - 1];
      }

      if (activeHeading) {
        this.setActiveItem(activeHeading.id);
      }

      ticking = false;
    };

    const requestTick = (): void => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    // Listen for scroll events
    window.addEventListener('scroll', requestTick, { passive: true });

    // Initial check
    updateActiveSection();
  }

  private setActiveItem(id: string): void {
    const nav = this.querySelector('[data-toc-nav]') as HTMLElement;
    if (!nav) return;

    // Remove active class from all links
    const links = nav.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    links.forEach((link: HTMLAnchorElement) => {
      link.classList.remove('active');
    });

    // Add active class to current link
    const activeLink = nav.querySelector(`a[href="#${id}"]`) as HTMLAnchorElement;
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  private setupSmoothScrolling(nav: HTMLElement): void {
    nav.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A') {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        
        if (targetId) {
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Calculate the target position with offset for sticky header
            const targetPosition = targetElement.offsetTop - this.scrollOffset;
            
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            });

            // Close mobile nav after clicking a link
            if (window.innerWidth <= 768) {
              this.closeMobileNav();
            }
          }
        }
      }
    });
  }

  private setupMobileToggle(toggle: HTMLElement | null, nav: HTMLElement): void {
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this.toggleMobileNav();
    });
  }

  private toggleMobileNav(): void {
    const nav = this.querySelector('[data-toc-nav]') as HTMLElement;
    const toggle = this.querySelector('[data-toc-toggle]') as HTMLElement;

    if (!nav || !toggle) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      nav.classList.add('open');
      toggle.classList.add('open');
    } else {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    }
  }

  private closeMobileNav(): void {
    const nav = this.querySelector('[data-toc-nav]') as HTMLElement;
    const toggle = this.querySelector('[data-toc-toggle]') as HTMLElement;

    if (!nav || !toggle) return;

    this.isOpen = false;
    nav.classList.remove('open');
    toggle.classList.remove('open');
  }
}

// Register the custom element
if (!customElements.get('table-of-contents')) {
  customElements.define('table-of-contents', TableOfContentsElement);
}

export default TableOfContentsElement;
