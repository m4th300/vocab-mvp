// Petit util pour signaler un changement des données locales (IndexedDB)
export function dbChanged() {
  window.dispatchEvent(new CustomEvent('db:changed'));
}
