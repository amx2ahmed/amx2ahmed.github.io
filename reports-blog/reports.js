const posts = [...document.querySelectorAll('.post')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const searchInput = document.getElementById('searchInput');
const postsContainer = document.getElementById('posts');
const empty = document.createElement('div');
empty.className = 'empty';
empty.textContent = 'No writeups match this search.';

function applyFilters(activeFilter = document.querySelector('.filters .active')?.dataset.filter || 'all') {
  const query = (searchInput?.value || '').trim().toLowerCase();
  let visible = 0;

  posts.forEach(post => {
    const tags = post.dataset.tags || '';
    const title = post.dataset.title || '';
    const text = post.textContent.toLowerCase();
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesSearch = !query || title.includes(query) || tags.includes(query) || text.includes(query);
    const show = matchesFilter && matchesSearch;
    post.hidden = !show;
    if (show) visible += 1;
  });

  if (!visible && !empty.isConnected) postsContainer.append(empty);
  if (visible && empty.isConnected) empty.remove();
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('active', item === button && item.closest('.filters')));
    if (!button.closest('.filters')) {
      const matching = document.querySelector(`.filters [data-filter="${button.dataset.filter}"]`);
      if (matching) {
        document.querySelectorAll('.filters button').forEach(item => item.classList.toggle('active', item === matching));
      }
    }
    applyFilters(button.dataset.filter);
  });
});

document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.search;
    applyFilters();
    searchInput.focus();
  });
});

searchInput?.addEventListener('input', () => applyFilters());
