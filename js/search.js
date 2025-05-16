window.addEventListener("load", function() {
    let container = document.getElementById("nav-container");
    let search = `<div id = "searchbar">
    <input type="text" id="search-input" placeholder="Search...">
    <button class="search-button" onclick="searchText()">Find</button>
    <button class="search-button "onclick="clearSearch()">Clear</button>
    <div id="search-results" class="search-dropdown"></div>
    </div>`;
    container.innerHTML = container.innerHTML+search;
    /*
    <button class="search-button" onclick="previousMatch()"><</button>
    <button class="search-button"onclick="nextMatch()">></button>
    
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight);
    document.getElementById('searchbar')s.style.height=""+height+"px";
    document.getElementById('nav-container').style.margin="0 0"+((-1*height)+100)+"px 0";
    */
});
let contentIndex = [];
let contentIndexLoaded = false;

async function fetchContentIndex() {
    try {
        console.log('Fetching content index...');
        const response = await fetch('js/content-index.json');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        contentIndex = await response.json();
        contentIndexLoaded = true;
        console.log('Content Index Loaded:', contentIndex); // Log the content index
    } catch (error) {
        console.error('Error loading content index:', error);
        // Show a message to the user if the content index is not found
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '<div class="no-results">Error loading content index. Please try again later.</div>';
        resultsContainer.style.display = 'block';
    }
}

function searchText() {
    try {
        if (!contentIndexLoaded) {
            console.log('Content index is not loaded yet.');
            return;
        }

        const query = document.getElementById('search-input').value.toLowerCase();
        if (!query) {
            document.getElementById('search-results').style.display = 'none';
            return;
        }

        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; // Clear previous results
        resultsContainer.style.display = 'block';
        console.log('Searching for:', query); // Log the search query

        let resultsFound = false;

        contentIndex.forEach(page => {
            const { title, url, content } = page;
            const regex = new RegExp(query, 'gi');
            let match;
            let pageResults = '';

            while ((match = regex.exec(content)) !== null) {
                console.log('Match found in:', title, 'at index:', match.index); // Log each match found
                const start = Math.max(0, match.index - 30);
                const end = Math.min(content.length, match.index + query.length + 30);
                const context = content.substring(start, end).replace(regex, '<span class="highlight">$&</span>');
                const contextId = `${title.replace(/\s+/g, '_')}-${match.index}`;

                const result = `<div class="results" id="${contextId}" onclick="navigateToContext('${url}', '${contextId}')">${context}...</div>`;
                pageResults += result;

                // Move the regex lastIndex forward to avoid infinite loop
                regex.lastIndex = match.index + match[0].length;
            }

            if (pageResults) {
                resultsFound = true;
                const pageTitle = `<div class="page-title">${title}</div>`;
                const pageResultsContainer = `<div>${pageResults}</div>`;
                resultsContainer.innerHTML += pageTitle + pageResultsContainer;
            }
        });

        if (!resultsFound) {
            resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        }
    } catch (error) {
        console.error('Error during search:', error);
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '<div class="no-results">Error during search. Please try again later.</div>';
        resultsContainer.style.display = 'block';
    }
}
function clearSearch() {
    document.getElementById('search-input').value = '';
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
}
function navigateToContext(url, contextId) {
    try {
        const currentUrl = window.location.href.split('#')[0];
        const element = document.getElementById(contextId);
        if (element) {
            const elementPosition = element.offsetTop+1000;
            sessionStorage.setItem('elementPosition', elementPosition);

            if (currentUrl === url) {
                // Scroll to the context if we are already on the same page
                window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                element.classList.add('highlight');
            } else {
                // Navigate to the new page
                sessionStorage.setItem('contextId', contextId);
                window.location.href = url;
            }
        }
    } catch (error) {
        console.error('Error navigating to context:', error);
    }
}

// Check if there is a contextId in session storage and scroll to it
window.onload = function() {
    fetchContentIndex();
    const contextId = sessionStorage.getItem('contextId');
    const elementPosition = sessionStorage.getItem('elementPosition');

    if (contextId && elementPosition) {
        window.scrollTo({ top: parseInt(elementPosition), behavior: 'smooth' });
        const element = document.getElementById(contextId);
        if (element) {
            element.classList.add('highlight');
        }
        sessionStorage.removeItem('contextId');
        sessionStorage.removeItem('elementPosition');
    }
};

/*let currentMatchIndex = -1;
let matches = [];

function searchText() {
    clearHighlights();
    currentMatchIndex = -1;
    matches = [];
    const input = document.getElementById('search-input').value;
    if (!input) return;
    const content = document.getElementById('main-content');
    const regex = new RegExp(input, 'gi');
    highlightText(content, regex);
    if (matches.length > 0) {
        currentMatchIndex = 0;
        focusCurrentMatch();
    }
}

function highlightText(element, regex) {
    if (element.nodeType === Node.TEXT_NODE) {
        const matchesArray = [...element.data.matchAll(regex)];
        console.log("got matches");
        if (matchesArray.length > 0) {
            const match = matchesArray[0];
            const matchText = match[0];
            const beforeText = element.data.slice(0, match.index);
            const afterText = element.data.slice(match.index + matchText.length);
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = matchText;
            element.data = beforeText;
            element.parentNode.insertBefore(span, element.nextSibling);
            matches.push(span);
            console.log("matches: " + matches);
            if (afterText) {
                const restNode = document.createTextNode(afterText);
                element.parentNode.insertBefore(restNode, span.nextSibling);
                highlightText(restNode, regex);
            }
        }
    } else if (element.nodeType === Node.ELEMENT_NODE) {
        element.childNodes.forEach(child => highlightText(child, regex));
    }
}
function clearHighlights() {
    const content = document.getElementById('main-content');
    const highlights = content.querySelectorAll('span.highlight, span.current-highlight');
    highlights.forEach(span => {
        span.replaceWith(document.createTextNode(span.textContent));
    });
}
function focusCurrentMatch() {
    if (matches.length === 0) return;
    matches.forEach((match, index) => {
        match.className = index === currentMatchIndex ? 'current-highlight' : 'highlight';
    });
    matches[currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function previousMatch() {
    if (matches.length === 0) return;
    if(currentMatchIndex === 0) {
        currentMatchIndex = matches.length-1;
    } else {
        currentMatchIndex--;
    }
    focusCurrentMatch();
}

function nextMatch() {
    if (matches.length === 0) return;
    if(currentMatchIndex === matches.length) {
        currentMatchIndex = 0;
    } else {
        currentMatchIndex++;
    }
    focusCurrentMatch();
}*/
