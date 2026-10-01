"use client";

import { useState, useEffect } from "react";

interface UserPreviewProps {
  count: number;
  allUsers: string[];
}

interface RandomUser {
  name: { first: string; last: string };
  picture: { medium: string; thumbnail: string };
  login: { username: string };
}

export function UserPreview({ count, allUsers }: UserPreviewProps) {
  const [users, setUsers] = useState<Array<{ username: string; name: string; avatar: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!count || allUsers.length === 0) {
      setUsers([]);
      return;
    }

    const fetchAvatars = async () => {
      setLoading(true);
      try {
        // Usar randomuser.me con nacionalidades latinas
        const nat = "mx,co,ar,pe,cl,ec,bo,ve";
        const response = await fetch(`https://randomuser.me/api/?results=${count * 3}&nat=${nat}&inc=name,picture,login&noinfo`);
        const data = await response.json();
        
        if (data.results) {
          const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5).slice(0, count);
          
          // Filtrar solo nombres latinos (letras latinas, sin cirílico, árabe, chino, etc.)
          const esNombreLatino = (str: string) => /^[\p{L}\p{M} '\-]+$/u.test(str) && !/[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]/.test(str);
          
          const latinos = data.results.filter((u: RandomUser) => 
            esNombreLatino(u.name.first) && esNombreLatino(u.name.last)
          );
          
          const usersWithAvatars = shuffledUsers.map((username, index) => {
            const randomUser = latinos[index % latinos.length] || latinos[0];
            return {
              username,
              name: `${randomUser.name.first} ${randomUser.name.last}`,
              avatar: randomUser.picture.thumbnail
            };
          });
          setUsers(usersWithAvatars);
        }
      } catch (error) {
        console.error("Error fetching avatars:", error);
        // Fallback: solo usernames sin avatares
        const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5).slice(0, count);
        setUsers(shuffledUsers.map(u => ({ username: u, name: u.replace("@", ""), avatar: "" })));
      } finally {
        setLoading(false);
      }
    };

    fetchAvatars();
  }, [count, allUsers]);

  if (users.length === 0 && !loading) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
        <label className="sm" style={{ margin: 0 }}>Usuarios que recibirán seguidores (vista previa aleatoria):</label>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["🇲🇽", "🇨🇴", "🇦🇷", "🇵🇪", "🇨🇱", "🇪🇨", "🇧🇴", "🇻🇪", "🇺🇸"].map((flag, i) => (
            <span key={i} title={["México","Colombia","Argentina","Perú","Chile","Ecuador","Bolivia","Venezuela","EE.UU."][i]} style={{ fontSize: 14 }}>
              {flag}
            </span>
          ))}
        </div>
      </div>
      <div style={{
        maxHeight: 250,
        overflowY: "auto",
        border: "1px solid var(--bd)",
        borderRadius: 8,
        background: "var(--bg)",
        padding: 8
      }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 20, color: "var(--mu)" }}>
            Cargando avatares...
          </div>
        )}
        {users.map((user, index) => (
          <div key={index} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 4px",
            borderBottom: index < users.length - 1 ? "1px solid var(--bd)" : "none"
          }}>
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
              />
            )}
            {!user.avatar && (
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "var(--g)", display: "grid", placeItems: "center",
                color: "#fff", fontWeight: 700, fontSize: 14
              }}>
                {user.username[1]?.toUpperCase() || "?"}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--mu)", fontFamily: "monospace" }}>
                {user.username}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tag">Se mostrarán {count} usuarios aleatorios de la base de datos. El pedido final usará una selección nueva.</div>
    </div>
  );
}
