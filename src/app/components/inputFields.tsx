import styles from "./inputFields.module.css";
import Image from "next/image";

interface InputFieldsProps {
  searchCliente: string;
  setSearchCliente: (value: string) => void;
  searchTecnico: string;
  setSearchTecnico: (value: string) => void;
}

export default function InputFields({
  searchCliente,
  setSearchCliente,
  searchTecnico,
  setSearchTecnico,
}: InputFieldsProps) {
  return (
    <div className={styles.inputFieldsContainer}>
      <div className={styles.inputWrapper}>
        <Image
          src="/lupa.svg"
          alt="search icon"
          className={styles.inputIcon}
          width={12}
          height={12}
        />
        <input
          id="searchCliente"
          type="text"
          placeholder="Pesquisar Cliente"
          className={styles.inputSearch}
          value={searchCliente}
          onChange={(e) => setSearchCliente(e.target.value)}
        />
      </div>
      <div className={styles.inputWrapper}>
        <Image
          src="/lupa.svg"
          alt="search icon"
          className={styles.inputIcon}
          width={12}
          height={12}
        />
        <input
          id="searchTecnico"
          type="text"
          placeholder="Pesquisar Técnico"
          className={styles.inputSearch}
          value={searchTecnico}
          onChange={(e) => setSearchTecnico(e.target.value)}
        />
      </div>
    </div>
  );
}
