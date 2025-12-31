import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

/* ================= TYPES ================= */

interface Item {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image?: string;
}

interface FormState {
  id: number | null;
  name: string;
  description: string;
  price: string;
}

const API = "http://localhost:4000/items";

/* ================= COMPONENT ================= */

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<FormState>({
    id: null,
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState<File | null>(null);

  /* ================= API ================= */

  const loadItems = async () => {
    const res = await axios.get<Item[]>(API);
    setItems(res.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadItems();
    };
    fetchData();
  }, []);

  /* ================= HANDLERS ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);

    if (image) {
      formData.append("image", image);
    }

    if (form.id !== null) {
      await axios.patch(`${API}/${form.id}`, formData);
    } else {
      await axios.post(API, formData);
    }

    setForm({ id: null, name: "", description: "", price: "" });
    setImage(null);
    loadItems();
  };

  const editItem = (item: Item) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price),
    });
  };

  const deleteItem = async (id: number) => {
    await axios.delete(`${API}/${id}`);
    loadItems();
  };

  /* ================= UI ================= */

  return (
    <Container style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Card>
          <CardContent>
            <Typography variant="h5">Mini CRUD UI</Typography>

            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <TextField
              label="Price"
              fullWidth
              margin="normal"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <Button component="label" variant="contained" fullWidth>
              Upload File
              <input hidden type="file" onChange={handleFileChange} />
            </Button>

            {image && (
              <Typography variant="body2">{image.name}</Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              style={{ marginTop: 16 }}
            >
              {form.id ? "Update" : "Add"}
            </Button>
          </CardContent>
        </Card>

        <div style={{ width: "100%" }}>
          {items.map((item) => (
            <Card key={item.id} style={{ marginBottom: 10 }}>
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  {item.image && (
                    <img
                      src={`http://localhost:4000/${item.image}`}
                      alt={item.name}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography color="text.secondary">
                      {item.price} ₹ — {item.description}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Button onClick={() => editItem(item)}>Edit</Button>
                  <Button
                    color="error"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
