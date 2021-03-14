import './dotmarkers.css';

export function BigDotMarker({ children }) {
  return (
    <div class="big-dot">
      {children}
    </div>
  );
}

export function SmallDotMarker({ children }) {
  return (
    <div class="small-dot">
      {children}
    </div>
  );
}
