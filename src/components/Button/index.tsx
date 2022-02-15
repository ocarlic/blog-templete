import styles from './button.module.scss';

interface ButtonProps {
  children: string;
  onClick: () => void;
}

export default function Button({
  children,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button type="button" className={styles.wrapper} onClick={onClick}>
      {children}
    </button>
  );
}
