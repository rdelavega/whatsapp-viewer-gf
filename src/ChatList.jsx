import React, { useState, useEffect } from "react";

const ChatList = () => {
  const [messages, setMessages] = useState([]); // Guarda los mensajes
  const [search, setSearch] = useState(""); // Estado de búsqueda
  const [searchDate, setSearchDate] = useState(""); // Estado para la búsqueda por fecha
  const [page, setPage] = useState(0); // Paginación
  const messagesPerPage = 50; // Cantidad de mensajes por página

  useEffect(() => {
    fetch("/public/chat.json") // Cargar JSON del chat
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error cargando el chat:", err));
  }, []);

  // Filtrar mensajes por búsqueda (texto + fecha)
  const filteredMessages = messages.filter((msg) => {
    const messageDate = new Date(msg.date).toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'

    // Búsqueda por texto (mensaje o autor)
    const matchesSearchText =
      (msg.sender && msg.sender.toLowerCase().includes(search.toLowerCase())) ||
      (msg.message && msg.message.toLowerCase().includes(search.toLowerCase()));

    // Búsqueda por fecha
    const matchesSearchDate = !searchDate || messageDate === searchDate;

    // El mensaje debe coincidir con ambas búsquedas (texto y/o fecha)
    return matchesSearchText && matchesSearchDate;
  });

  // Obtener mensajes de la página actual
  const paginatedMessages = filteredMessages.slice(
    page * messagesPerPage,
    (page + 1) * messagesPerPage
  );

  // Cambiar la página de los mensajes
  const handleNextPage = () => {
    if ((page + 1) * messagesPerPage < filteredMessages.length) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Función para manejar el cambio de la fecha en el input
  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
    setPage(0); // Reseteamos la página cuando se cambia la búsqueda por fecha
  };

  return (
    <div className="chat-container">
      {/* Campo de búsqueda de texto */}
      <input
        type="text"
        placeholder="Buscar mensajes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Campo de búsqueda por fecha */}
      <input
        type="date"
        value={searchDate}
        onChange={handleDateChange}
        placeholder="Buscar por fecha"
      />

      <div className="chat-messages">
        {paginatedMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.author === "Rodrigo De la Vega" ? "me" : "them"
            }`}
          >
            <strong>{msg.author}</strong> {msg.message}
            <br />
            <small>{new Date(msg.date).toLocaleString("es-MX")}</small>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          ⬅️ Anterior
        </button>
        <span>Página {page + 1}</span>
        <button
          onClick={handleNextPage}
          disabled={(page + 1) * messagesPerPage >= filteredMessages.length}
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
};

export default ChatList;
