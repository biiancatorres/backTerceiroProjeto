// import express from 'express';
const express = require('express');

// import createClient from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
// import {createClient} from '@supabase/supabase-js'
const supabaseClient = require('@supabase/supabase-js');

// import morgan from 'morgan';
const morgan = require('morgan');

// import bodyParser from "body-parser";
const bodyParser = require('body-parser');

// import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const app = express();

const cors = require("cors");
const corsOptions = {
   origin: '*', 
   credentials: true,            // access-control-allow-credentials: true
   optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase = 
    supabaseClient.createClient('https://ihmbsvsnhbyckbhphytb.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobWJzdnNuaGJ5Y2tiaHBoeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NTMyNTYsImV4cCI6MjA0NjMyOTI1Nn0.CYTpBVsSM61HovAJ0aYXpCwM3bKE2X0lRL6vSdRkp0E')

app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select()

    if (error) {
        res.status(500).send({ message: "Erro ao listar produtos", error });
        return;
    }

    res.send(data);
    console.log(`Lista de produtos:`, data);
});

app.get('/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id, 10); // Converte o ID para inteiro
    console.log("ID recebido na requisição:", productId);

    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', productId); // Certifique-se de usar o tipo correto para o ID

    console.log("Dados retornados pelo Supabase:", data);
    console.log("Erro retornado pelo Supabase:", error);

    if (error) {
        res.status(500).send({ message: "Erro ao buscar produto.", error });
        return;
    }

    if (!data || data.length === 0) {
        res.status(404).send({ message: "Produto não encontrado." });
        return;
    }

    console.log("Produto encontrado:", data[0]); // Mostrar o produto encontrado
    res.status(200).send(data[0]);
});

app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;
    console.log("Recebendo dados para criação do produto:", name, description, price);

    const { data, error } = await supabase
        .from('products')
        .insert({
            name: name,
            description: description,
            price: price,
        })

    if (error) {
        res.status(500).send({ message: "Erro ao criar produto.", error });
        return;
    }

    res.status(201).send("Produto criado com sucesso!");
    console.log("Produto criado:", data);
});

app.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;

    console.log(`Atualizando produto com ID ${productId}:`, name, description, price);

    const { data, error } = await supabase
        .from('products')
        .update({
            name: name,
            description: description,
            price: price
        })
        .eq('id', productId);

    if (error) {
        res.status(500).send({ message: "Erro ao atualizar produto.", error });
        return;
    }

    res.status(200).send("Produto atualizado com sucesso!");
    console.log("Produto atualizado:", data);
});

app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    console.log(`Deletando produto com ID ${productId}`);

    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) {
        res.status(500).send({ message: "Erro ao deletar produto.", error });
        return;
    }

    res.status(200).send("Produto deletado com sucesso!");
    console.log("Produto deletado:", data);
});

app.get('/', (req, res) => {
    res.send("Hello, I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    res.send("Hello again, I am working my friend to the moon and behind <3");
});

app.listen(4000, () => {
    console.log(`> Ready on http://localhost:4000`);
});
