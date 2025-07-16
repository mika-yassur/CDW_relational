// Set up SVG with zoom capabilities
const svg = d3.select("#network");
const width = window.innerWidth;
const height = window.innerHeight;

svg.attr("width", width).attr("height", height);

// Create zoom behavior
const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", handleZoom);

// Apply zoom to SVG
svg.call(zoom);

// Create main group for all elements (this will be transformed)
const mainGroup = svg.append("g").attr("class", "main-group");

// Create groups for links and nodes within the main group
const linkGroup = mainGroup.append("g").attr("class", "links");
const nodeGroup = mainGroup.append("g").attr("class", "nodes");

// Zoom handler
function handleZoom(event) {
    const { transform } = event;
    mainGroup.attr("transform", transform);
    
    // Update zoom info display
    const zoomInfo = document.getElementById("zoom-info");
    if (zoomInfo) {
        zoomInfo.textContent = `Zoom: ${transform.k.toFixed(2)}x | Pan: (${Math.round(transform.x)}, ${Math.round(transform.y)})`;
    }
}
// Zoom functions
function zoomIn() {
    svg.transition().duration(300).call(zoom.scaleBy, 1.5);
}

function zoomOut() {
    svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5);
}

function resetZoom() {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '=':
            case '+':
                event.preventDefault();
                zoomIn();
                break;
            case '-':
                event.preventDefault();
                zoomOut();
                break;
            case '0':
                event.preventDefault();
                resetZoom();
                break;
        }
    }
});
// Special hover group nodes
const hoverGroup = ["photography", "Joan Didion", "Anne Carson", "aesthetics"];

// Create nodes
const node = nodeGroup.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 8)
    .on("mouseover", function(event, d) {
        if (hoverGroup.includes(d.id)) {
            highlightHoverGroup(true);
            showTooltip(event);
        }
    })
    .on("mouseout", function(event, d) {
        if (hoverGroup.includes(d.id)) {
            highlightHoverGroup(false);
            hideTooltip();
        }
    })
    javascript// Hover group functionality
function highlightHoverGroup(highlight) {
    const hoverGroup = ["photography", "Joan Didion", "Anne Carson", "aesthetics"];
    
    // Highlight/unhighlight nodes
    node.classed("highlighted", function(d) {
        return highlight && hoverGroup.includes(d.id);
    });
    
    // Highlight/unhighlight links between hover group nodes
    link.classed("highlighted", function(d) {
        return highlight && 
            hoverGroup.includes(d.source.id) && 
            hoverGroup.includes(d.target.id);
    });
}

function showTooltip(event) {
    const tooltip = document.getElementById("hover-tooltip");
    tooltip.style.display = "block";
    tooltip.style.left = event.pageX + "px";
    tooltip.style.top = event.pageY + "px";
}

function hideTooltip() {
    const tooltip = document.getElementById("hover-tooltip");
    tooltip.style.display = "none";
}

node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));