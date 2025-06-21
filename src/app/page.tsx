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
import SWR from "swr";
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

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH}`,
        InWebPublicKey: process.env.NEXT_PUBLIC_API_IN_WEB_PUBLIC_KEY || "",
      },
    }).then((res) => res.json());

  const { data: initialProblemas = [] } = SWR("/api/paERP", fetcher);

  console.log("Initial Problemas:", initialProblemas); // Check the fetched data

  const [columns, setColumns] = useState<Record<string, Problema[]>>(() =>
    Object.fromEntries(
      statusCategories.map((status) => [status, []]) // Initialize with empty arrays
    )
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
              ref={(node)=>{
                provided.innerRef(node);
                cardRef.current = node as HTMLDivElement;
              }}
              // ref={provided.innerRef}
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
              <div className={styles.expandIcon} onClick={(e) => {
                const details = cardRef.current?.querySelector("details");
                const button = e.currentTarget;
                if (details) {
                  console.log("Details element:", details.open);
                  details.open = !details.open;
                  if (details.open) {
                    button.classList.add(styles.expandIconOpen);
                  } else {
                    button.classList.remove(styles.expandIconOpen);
                  }
                }
              }}></div>
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
                    <strong>{new Date(item.Data).toLocaleTimeString()}</strong>{" "}
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
                    {/* <span>{item.posicao}</span> */}
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
        id: String(item.id || item.nopat || ""), 
        NºPat: item.nopat || 0,
        NCont: item.ncont || 0,
        Nome: item.nome || "",
        ProblemaDescricao: item.problema || "",
        Status: item.status || "",
        Tecnico: item.tecnnm || "",
        Data: item.sk_dateTimeCreation || "",
        posicao: item.posicao || 0,
      }));

      const sortedProblemas = mappedProblemas.sort(
        (a, b) => a.posicao - b.posicao
      );

      console.log("Mapped Problemas:", sortedProblemas);

      const groupedColumns = Object.fromEntries(
        statusCategories.map((status) => [
          status,
          mappedProblemas.filter((item) => item.Status === status),
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

      const changedItems = [
        ...newColumns[source.droppableId],
        ...newColumns[destination.droppableId],
      ].filter((item, index) => item.posicao !== index);

      changedItems.forEach((item) => {
        updateStatus(item.id, item.Status, item.posicao);
      });

      return newColumns;
    });
  };

  const updateStatus = async (
    itemId: string,
    newStatus: string,
    newPosicao: number
  ) => {
    try {
      console.log("Updating status for item:", itemId);
      console.log(`(${itemId}) New status:`, newStatus);
      console.log(`(${itemId}) New position:`, newPosicao);
      const response = await fetch(`/api/paERP/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH}`,
          InWebPublicKey: process.env.NEXT_PUBLIC_API_IN_WEB_PUBLIC_KEY || "",
        },
        body: JSON.stringify({
          nopat: itemId,
          status: newStatus,
          posicao: newPosicao,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update status", response.statusText);
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
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
                    {/* <div className={styles.filter}>
                      <span>Últimos</span>
                      <div className={styles.dropdownWrapper}>
                        <select
                          className={styles.dropdown}
                          onChange={(e) => handleDaysFilterChange(status, e.target.value)}
                        >
                          <option value="5">5 dias</option>
                          <option value="10">10 dias</option>
                          <option value="30">30 dias</option>
                          <option value="all">Todos</option>
                        </select>
                      </div>
                    </div> */}
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
