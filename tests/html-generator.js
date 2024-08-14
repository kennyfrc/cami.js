(function() {
    function createHtmlStructure() {
        document.body.innerHTML = `
            <h1>Test Suite</h1>
            <div id="progressIndicator"></div>
            <div id="summary"></div>
            <div id="filters" style="display: none;">
                <label><input type="radio" name="specFilter" value="all" checked> All Specs</label>
                <label><input type="radio" name="specFilter" value="failed"> Failed Specs</label>
            </div>
            <div id="testResults"></div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            body { font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif; background-color: #fcfcfc; color: #202020; }
            #progressIndicator { margin-top: 10px; }
            .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
            .dot.pass { background-color: #30a46c; }
            .dot.fail { background-color: #e5484d; }
            #summary { margin-top: 10px; font-weight: bold; }
            #filters { margin-top: 10px; }
            #testResults { margin-top: 20px; }
            .suite { margin-bottom: 10px; margin-left: 20px; }
            .suite-name { font-weight: bold; }
            .spec { margin-left: 20px; padding: 5px; border-radius: 3px; }
            .spec.pass { background-color: #e6f6eb; border-left: 5px solid #30a46c; }
            .spec.fail { background-color: #feebec; border-left: 5px solid #e5484d; }
        `;
        document.head.appendChild(style);
    }

    function updateProgress(status) {
        const progressIndicator = document.getElementById('progressIndicator');
        if (progressIndicator) {
            const dot = document.createElement('span');
            dot.className = `dot ${status}`;
            progressIndicator.appendChild(dot);
        } else {
            console.warn('Progress indicator element not found');
        }
    }

    function displaySummary(totalSpecs, failures) {
        const summaryElement = document.getElementById('summary');
        summaryElement.textContent = `${totalSpecs} ${totalSpecs === 1 ? 'spec' : 'specs'}, ${failures} ${failures === 1 ? 'failure' : 'failures'}`;
    }

    function showFilters() {
        const filtersElement = document.getElementById('filters');
        filtersElement.style.display = 'block';

        document.querySelectorAll('input[name="specFilter"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (window.testResults) {
                    displayResults(window.testResults);
                }
            });
        });
    }

    function renderSuite(suite, element, filterValue) {
        const suiteElement = document.createElement('div');
        suiteElement.className = 'suite';
        suiteElement.innerHTML = `<div class="suite-name">${suite.description}</div>`;

        let hasVisibleSpecs = false;

        suite.specs.forEach(spec => {
            if (filterValue === 'all' || (filterValue === 'failed' && spec.status === 'fail')) {
                const specElement = document.createElement('div');
                specElement.className = `spec ${spec.status}`;
                specElement.textContent = spec.status === 'pass'
                    ? `✓ ${spec.description}`
                    : `✗ ${spec.description} - ${spec.error}`;
                suiteElement.appendChild(specElement);
                hasVisibleSpecs = true;
            }
        });

        suite.suites.forEach(nestedSuite => {
            const nestedElement = renderSuite(nestedSuite, suiteElement, filterValue);
            if (nestedElement) {
                hasVisibleSpecs = true;
            }
        });

        if (hasVisibleSpecs) {
            element.appendChild(suiteElement);
            return suiteElement;
        }
        return null;
    }

    function displayResults(results) {
        const resultsElement = document.getElementById('testResults');
        resultsElement.innerHTML = '';

        const filterValue = document.querySelector('input[name="specFilter"]:checked').value;

        results.forEach(suite => {
            renderSuite(suite, resultsElement, filterValue);
        });
    }

    // Expose necessary functions to the global scope
    window.TestRunnerDisplay = {
        createHtmlStructure,
        updateProgress,
        displaySummary,
        showFilters,
        displayResults
    };

    // Initialize the HTML structure when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHtmlStructure);
    } else {
        createHtmlStructure();
    }
})();
