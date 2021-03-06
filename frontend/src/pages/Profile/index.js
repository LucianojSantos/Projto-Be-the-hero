import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";
import api from "../services/api";

import logo from "../../assets/logo.svg";
import "./styles.css";

export default function Profile() {
  const [incidents, setIncidents] = useState([]);
  const history = useHistory();
  const ongId = localStorage.getItem("ongId");
  const ongName = localStorage.getItem("ongName");

  const handleDelete = async id => {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          authorization: ongId
        }
      });
      setIncidents(incidents.filter(incidents => incidents.id !== id));
      alert("Caso deletado com sucesso.");
    } catch (err) {
      alert("Erro, tente novamente");
    }
  };

  useEffect(() => {
    api
      .get("profile", {
        headers: {
          authorization: ongId
        }
      })
      .then(response => {
        setIncidents(response.data);
      });
  }, [ongId]);

  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <div className="profile-container">
      <header>
        <img src={logo} alt="Be The Hero" />
        <span>Bem vinda, {ongName}</span>
        <Link className="button" to="/incidents/new">
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e2041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>
      <ul>
        {incidents.map(item => (
          <li key={item.id}>
            <strong>CASO:</strong>
            <p>{item.title}</p>
            <strong>DESCRIÇÃO</strong>
            <p>{item.description}</p>
            <strong>VALOR:</strong>
            <p>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(item.value)}
            </p>

            <button type="button" onClick={() => handleDelete(item.id)}>
              <FiTrash2 size={20} color="#A8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}