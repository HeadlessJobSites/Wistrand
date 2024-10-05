<script>
document.addEventListener('DOMContentLoaded', function() {
    // Get the content of the position-title element
    var positionTitle = document.getElementById('position-title').textContent.trim();

    // Only update the title if it's still set to the default
    if (positionTitle && document.title === 'Jobbannons') {
        document.title = positionTitle; // Set the page title to the position title
    }
});
</script>
