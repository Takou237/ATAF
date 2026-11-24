/**
 * Petit module d'interaction pour les survols.
 *
 * Il fait deux choses, uniquement à la souris :
 * - il met à jour `--mx` / `--my` sur la carte survolée, ce qui déplace la
 *   lueur dessinée en CSS (`radial-gradient`) ;
 * - il en déduit `--rx` / `--ry` pour une très légère inclinaison 3D dans le
 *   sens du mouvement.
 *
 * Les logos du bandeau ne sont volontairement pas concernés : ils défilent,
 * la lueur resterait accrochée au mauvais logo.
 *
 * Aucun rendu React : une seule écoute déléguée sur le document. Seuls les
 * événements souris/stylet déclenchent l'effet, jamais le tactile.
 */

const SELECTOR = '.ataf-hover-card';
const MAX_TILT = 4;

let installed = false;

export function installHoverFx(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  let active: HTMLElement | null = null;
  let box: DOMRect | null = null;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const reset = (element: HTMLElement) => {
    element.style.removeProperty('--mx');
    element.style.removeProperty('--my');
    element.style.removeProperty('--rx');
    element.style.removeProperty('--ry');
  };

  const paint = () => {
    frame = 0;
    if (!active || !box || !box.width || !box.height) return;

    const x = Math.min(1, Math.max(0, (pointerX - box.left) / box.width));
    const y = Math.min(1, Math.max(0, (pointerY - box.top) / box.height));

    active.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
    active.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);

    active.style.setProperty('--ry', `${((x - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
    active.style.setProperty('--rx', `${((0.5 - y) * MAX_TILT * 2).toFixed(2)}deg`);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  const onPointerMove = (event: PointerEvent) => {
    // Le tactile ne déclenche rien : on ne veut pas d'effet au doigt.
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(SELECTOR)
        : null;

    if (target !== active) {
      if (active) reset(active);
      active = target;
      // On mémorise la boîte avant toute transformation : sinon l'inclinaison
      // modifierait la mesure et créerait une oscillation.
      box = active ? active.getBoundingClientRect() : null;
    }

    if (!active) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    schedule();
  };

  const clear = () => {
    if (active) reset(active);
    active = null;
    box = null;
  };

  const remeasure = () => {
    if (active) box = active.getBoundingClientRect();
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('scroll', remeasure, { capture: true, passive: true });
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('blur', clear);
  document.documentElement.addEventListener('pointerleave', clear);
}
