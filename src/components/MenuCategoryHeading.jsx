const SIN_TACC_SRC = {
  negro: '/images/sin-tacc-negro.png',
  claro: '/images/sin-tacc-claro.png',
};

export default function MenuCategoryHeading({ name, glutenFree = false, variant = 'negro' }) {
  return (
    <span className="menu-category-heading">
      <span>{name}</span>
      {glutenFree && (
        <img
          src={SIN_TACC_SRC[variant]}
          alt="Sin TACC"
          className="sin-tacc-icon"
        />
      )}
    </span>
  );
}
