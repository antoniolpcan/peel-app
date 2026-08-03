interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:scale-125 hover:text-red-500 transition-all cursor-pointer text-app-text"
      title="Deletar"
    >
      🗑️
    </button>
  );
}