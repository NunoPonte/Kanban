"use client";

import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Navbar from "./components/navbar";
import InputFields from "./components/inputFields";

interface Problema {
  id: string;
  NºPat: number;
  NCont: number;
  Nome: string;
  ProblemaDescricao: string;
  Status: string;
  Tecnico: string;
  Data: string;
  posicao: number;
}

// DADOS FIXOS PARA OS CARDS
const staticProblemas: Problema[] = [
  {
    id: "1",
    NºPat: 123,
    NCont: 1,
    Nome: "José da Silva",
    ProblemaDescricao: "Problema no sistema de login.",
    Status: "Backlog",
    Tecnico: "João",
    Data: "2025-06-23T09:00:00",
    posicao: 0,
  },
  {
    id: "2",
    NºPat: 456,
    NCont: 2,
    Nome: "Joana Souza",
    ProblemaDescricao: "Erro ao imprimir relatório.",
    Status: "Análise",
    Tecnico: "Maria",
    Data: "2025-06-22T10:30:00",
    posicao: 0,
  },
  {
    id: "3",
    NºPat: 789,
    NCont: 3,
    Nome: "Tiago Oliveira",
    ProblemaDescricao: "Sistema lento ao abrir tela.",
    Status: "Em Tratamento",
    Tecnico: "Carlos",
    Data: "2025-06-21T14:15:00",
    posicao: 0,
  },
  {
    id: "4",
    NºPat: 101,
    NCont: 4,
    Nome: "Pedro Santos",
    ProblemaDescricao: "Dúvida sobre funcionalidade X.",
    Status: "Aguarda Cliente",
    Tecnico: "Ana",
    Data: "2025-06-20T16:45:00",
    posicao: 0,
  },
  {
    id: "5",
    NºPat: 202,
    NCont: 5,
    Nome: "Gonçalo Lima",
    ProblemaDescricao: "Solicitação de proposta.",
    Status: "Aguarda Proposta",
    Tecnico: "Pedro",
    Data: "2025-06-19T11:20:00",
    posicao: 0,
  },
  {
    id: "6",
    NºPat: 303,
    NCont: 6,
    Nome: "Diana Costa",
    ProblemaDescricao: "Problema resolvido.",
    Status: "Fechado",
    Tecnico: "Lucas",
    Data: "2025-06-18T08:10:00",
    posicao: 0,
  },
   {
    id: "7",
    NºPat: 404,
    NCont: 7,
    Nome: "Rita Martins",
    ProblemaDescricao: "Falha ao exportar para Excel.",
    Status: "Backlog",
    Tecnico: "João",
    Data: "2025-06-23T11:00:00",
    posicao: 0,
  },
  {
    id: "8",
    NºPat: 505,
    NCont: 8,
    Nome: "Miguel Alves",
    ProblemaDescricao: "Impressora não responde.",
    Status: "Análise",
    Tecnico: "Maria",
    Data: "2025-06-22T15:45:00",
    posicao: 0,
  },
  {
    id: "9",
    NºPat: 606,
    NCont: 9,
    Nome: "Carla Ferreira",
    ProblemaDescricao: "Erro de autenticação no email.",
    Status: "Em Tratamento",
    Tecnico: "Carlos",
    Data: "2025-06-21T17:30:00",
    posicao: 0,
  },
  {
    id: "10",
    NºPat: 707,
    NCont: 10,
    Nome: "Bruno Lopes",
    ProblemaDescricao: "Solicitação de alteração de senha.",
    Status: "Aguarda Cliente",
    Tecnico: "Ana",
    Data: "2025-06-20T18:00:00",
    posicao: 0,
  },
  {
    id: "11",
    NºPat: 808,
    NCont: 11,
    Nome: "Sofia Pinto",
    ProblemaDescricao: "Dúvida sobre relatório financeiro.",
    Status: "Aguarda Proposta",
    Tecnico: "Pedro",
    Data: "2025-06-19T13:10:00",
    posicao: 0,
  },
  {
    id: "12",
    NºPat: 909,
    NCont: 12,
    Nome: "André Sousa",
    ProblemaDescricao: "Backup realizado com sucesso.",
    Status: "Fechado",
    Tecnico: "Lucas",
    Data: "2025-06-18T09:30:00",
    posicao: 0,
  },
];

export default function Page() {
  const statusCategories = React.useMemo(
    () => [
      "Backlog",
      "Análise",
      "Em Tratamento",
      "Aguarda Cliente",
      "Aguarda Proposta",
      "Fechado",
    ],
    []
  );

  const [searchCliente, setSearchCliente] = useState("");
  const [searchTecnico, setSearchTecnico] = useState("");

  // NÃO BUSCA MAIS DA API, USA OS DADOS FIXOS
  const initialProblemas = staticProblemas;

  const [columns, setColumns] = useState<Record<string, Problema[]>>(() =>
    Object.fromEntries(statusCategories.map((status) => [status, []]))
  );

  const DraggableContainer = React.memo(
    ({
      item,
      index,
      getItemStyle,
    }: {
      item: Problema;
      index: number;
      getItemStyle: (
        isDragging: boolean,
        draggableStyle: DraggableStyle | undefined
      ) => React.CSSProperties;
    }) => {
      const cardRef = React.useRef<HTMLDivElement>(null);
      return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={(node) => {
                provided.innerRef(node);
                cardRef.current = node as HTMLDivElement;
              }}
              {...provided.draggableProps}
              style={{
                ...getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                ),
                opacity: snapshot.isDragging ? 0.5 : 1,
                position: snapshot.isDragging ? "absolute" : "relative",
              }}
              className={`${
                snapshot.isDragging ? "dragging previewDragging" : ""
              } draggable`}
            >
              <div
                className={styles.expandIcon}
                onClick={(e) => {
                  const details = cardRef.current?.querySelector("details");
                  const button = e.currentTarget;
                  if (details) {
                    details.open = !details.open;
                    if (details.open) {
                      button.classList.add(styles.expandIconOpen);
                    } else {
                      button.classList.remove(styles.expandIconOpen);
                    }
                  }
                }}
              ></div>
              <div {...provided.dragHandleProps}>
                <div className={styles.cardHeader}>
                  <div className={styles.dateTime}>
                    <img
                      src="/calendario.png"
                      alt="Calendário"
                      className={styles.icon}
                    />
                    <strong>{item.Data.split("T")[0]}</strong>{" "}
                  </div>
                  <div className={styles.dateTime}>
                    <img
                      src="/relogio.png"
                      alt="Relógio"
                      className={styles.icon}
                    />
                    <strong>
                      {new Date(item.Data).toLocaleTimeString()}
                    </strong>{" "}
                  </div>
                </div>

                <div className={styles.cliente}>
                  <strong>Cliente</strong>
                  <span>{item.Nome}</span>
                </div>
                <div className={styles.row}>
                  <div className={styles.pat}>
                    <strong>Pat nº</strong>
                    <span>{item.NºPat}</span>
                  </div>
                  <div className={styles.urgencia}>
                    <strong>Urgência</strong>
                    <span>P3</span>
                  </div>
                </div>
                <div className={styles.problem}>
                  <strong>Problema</strong>
                  <details className={styles.problemDetails}>
                    <summary className={styles.problemSummary}>
                      <span className={styles.truncatedText}>
                        {item.ProblemaDescricao}
                      </span>
                    </summary>
                    <p className={styles.problemDescription}>
                      {item.ProblemaDescricao}
                    </p>
                    <div className={styles.tecnico}>
                      <strong>Técnico</strong>
                      <span>{item.Tecnico}</span>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      );
    },
    (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
  );

  DraggableContainer.displayName = "DraggableContainer";

  useEffect(() => {
    if (initialProblemas.length > 0) {
      const mappedProblemas: Problema[] = initialProblemas.map((item: any) => ({
        ...item,
      }));

      const sortedProblemas = mappedProblemas.sort(
        (a, b) => a.posicao - b.posicao
      );

      const groupedColumns = Object.fromEntries(
        statusCategories.map((status) => [
          status,
          sortedProblemas.filter((item) => item.Status === status),
        ])
      );

      setColumns(groupedColumns);
    }
  }, [initialProblemas, statusCategories]);

  const onDragEnd = async (result: { source: any; destination: any }) => {
    const { source, destination } = result;

    if (!destination) return;

    setColumns((prev) => {
      const newColumns = { ...prev };

      const sourceColumn = [...newColumns[source.droppableId]];
      const destinationColumn = [...newColumns[destination.droppableId]];

      if (source.droppableId === destination.droppableId) {
        const [movedItem] = sourceColumn.splice(source.index, 1);
        sourceColumn.splice(destination.index, 0, movedItem);

        sourceColumn.forEach((item, index) => {
          item.posicao = index;
        });

        newColumns[source.droppableId] = sourceColumn;
      } else {
        const [movedItem] = sourceColumn.splice(source.index, 1);
        movedItem.Status = destination.droppableId;

        destinationColumn.splice(destination.index, 0, movedItem);

        sourceColumn.forEach((item, index) => {
          item.posicao = index;
        });
        destinationColumn.forEach((item, index) => {
          item.posicao = index;
        });

        newColumns[source.droppableId] = sourceColumn;
        newColumns[destination.droppableId] = destinationColumn;
      }

      return newColumns;
    });
  };

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableStyle | undefined,
    status: string
  ): React.CSSProperties => ({
    userSelect: "none",
    padding: 16,
    margin: `0 0 8px 0`,
    background: isDragging
      ? "lightblue"
      : status === "Backlog"
      ? "#407dff"
      : status === "Fechado"
      ? "#00c763"
      : "#474747",
    transition: isDragging ? "opacity 0.1s ease-out" : "none",
    borderRadius: "8px",
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean, status: string) => ({
    padding: 8,
    width: 320,
    height: "80vh",
  });

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.columnsContainer}>
          {statusCategories.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver, status)}
                  className={`${styles.draggable_content} ${
                    snapshot.isDraggingOver ? "droppableOver" : ""
                  }`}
                >
                  <div className={styles.columnHeader}>
                    <div className={styles.columnTitle}>{status}</div>
                  </div>
                  <div className={styles.cardsContainer}>
                    {columns[status]
                      .filter((item) => {
                        const clienteMatch = searchCliente
                          ? item.Nome.toLowerCase().startsWith(
                              searchCliente.toLowerCase()
                            )
                          : true;
                        const tecnicoMatch = searchTecnico
                          ? item.Tecnico.toLowerCase().startsWith(
                              searchTecnico.toLowerCase()
                            )
                          : true;
                        return clienteMatch && tecnicoMatch;
                      })
                      .map((item, index) => (
                        <DraggableContainer
                          key={item.id}
                          item={item}
                          index={item.posicao}
                          getItemStyle={(isDragging, draggableStyle) =>
                            getItemStyle(
                              isDragging,
                              draggableStyle,
                              item.Status
                            )
                          }
                        />
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className={styles.inputFieldsWrapper}>
        <InputFields
          searchCliente={searchCliente}
          setSearchCliente={setSearchCliente}
          searchTecnico={searchTecnico}
          setSearchTecnico={setSearchTecnico}
        />
      </div>
    </div>
  );
}