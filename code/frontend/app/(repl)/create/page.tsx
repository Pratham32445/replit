"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const createRepl = async () => {
  const BACKEND_URL = "http://localhost:5000";
  const { data } = await axios.get("/api/token");
  const token = data.token;
  if (token) {
    await axios.post(
      `${BACKEND_URL}/api/v1/repl/create`,
      { baseLanguage: "nodejs" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};

const CreateRepl = () => {
  return (
    <div>
      <Button onClick={createRepl}>Create</Button>
    </div>
  );
};

export default CreateRepl;
