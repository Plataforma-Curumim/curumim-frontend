const express = require('express');
const path = require('path');
const cors = require('cors');
const { Console } = require('console');
const app = express();
const port = 4001;

// Array para armazenar os usuários
let users = [];
let books = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'IdentificacaoUsuario.html'));
});

app.get('/IdentificacaoLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'IdentificacaoLivro.html'));
});

app.get('/confirmacaoEmprestimo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'confirmacaoEmprestimo.html'));
});

app.get('/Agradecimento', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Agradecimento.html'));
});

app.get('/CadastroLivros', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'CadastroLivros.html'));
});

app.get('/CadastroUsuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'CadastroUsuario.html'));
});

app.get('/Contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Contato.html'));
});


// ROTAS //

// Rota para buscar usuário com base no RFID
app.post('/api/management/get/user', (req, res) => {
    const { rfidId } = req.body; // Obtenha o RFID do corpo da requisição

    if (!rfidId) {
        return res.status(400).json({ error: 'ID do usuário não fornecido' });
    }

    // Busca o usuário no array
    const user = users.find(user => user.rfidId === rfidId);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

// Rota de cadastro de usuário
app.post('/api/management/register/user', (req, res) => {
    const { idUser: rfidId, name, cpfCnpj, email, username, password, dateOfBirth, numberPhone, address, typeUser } = req.body;

    if (rfidId && name && cpfCnpj && email && username && password && dateOfBirth && numberPhone && address && typeUser) {
        // Adiciona o usuário ao array
        users.push({ rfidId, name, cpfCnpj, email, username, password, dateOfBirth, numberPhone, address, typeUser });
        res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
    } else {
        res.status(400).json({ error: 'Dados incompletos. Preencha todos os campos corretamente.' });
    }
});

app.post('/api/management/register/book', (req, res) => {
    const { rfidId, title, subtitle, author, sinopse, gender, language, urlImage, publishers, publishDate, physicalDimensions, publishPlaces, numberOfPages, isbn } = req.body;
    console.log('Requisição recebida no /api/management/register/bool');
    console.log(req.body);
    console.log('RODOU PORRA')
    // Verifica se os campos obrigatórios estão preenchidos
    if (rfidId && title && author) {
        // Adiciona o livro ao array de livros
        books.push({rfidId, title, subtitle, author, sinopse, gender, language, urlImage, publishers, publishDate, physicalDimensions, publishPlaces, numberOfPages, isbn
        
        }); // se não tiver isbn ele vai dar problema nesse push?

        res.status(200).json({ message: 'Livro cadastrado com sucesso!' });
    } else {
        res.status(400).json({ error: 'Dados incompletos. Preencha todos os campos corretamente.' });
    }
});

const getBookByRFID = (rfidId) => {
    return books.find(book => book.rfidId === rfidId);
};

// Rota para buscar livro com base no RFID
app.post('/api/management/get/book', (req, res) => {
    const { rfidId } = req.body; // Obtenha o RFID do corpo da requisição
    
    if (!rfidId) {
        return res.status(400).json({ error: 'RFID não fornecido' });
    }
    
    const book = getBookByRFID(rfidId);
    
    if (book) {
        const dataBook = {
            root: {
                userRootId: 'root1', // Defina conforme necessário
                libraryId: 'library1' // Defina conforme necessário
            },
            rfidId: book.rfidId,
            isbn: book.isbn,
            title: book.title,
            subtitle: book.subtitle,
            author: book.author,
            sinopse: book.sinopse,
            gender: book.gender,
            language: book.language,
            urlImage: book.urlImage,
            publishers: book.publishers,
            publishDate: book.publishDate,
            physicalDimensions: book.physicalDimensions,
            publishPlaces: book.publishPlaces,
            numberOfPages: book.numberOfPages
        };
        
        res.status(200).json(dataBook);
    } else {
        res.status(404).json({ error: 'Livro não encontrado' });
    }
});



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    
    // const getBookByRFID = (rfidId) => {
    //     const books = [
    //         {
    //             root: {
    //                 userRootId: 'root1',
    //                 libraryId: 'library1'
    //             },
    //             rfidId: '12345',
    //             isbn: '978-3-16-148410-0',
    //             title: 'Livro Exemplo',
    //             subtitle: 'Subtítulo Exemplo',
    //             author: 'Autor Exemplo',
    //             sinopse: 'Sinopse do livro exemplo.',
    //             gender: 'Ficção',
    //             language: 'Português',
    //             urlImage: 'http://exemplo.com/imagem.jpg',
    //             publishers: ['Editora Exemplo'],
    //             publishDate: '2024-01-01',
    //             physicalDimensions: '20x15 cm',
    //             publishPlaces: ['Cidade Exemplo'],
    //             numberOfPages: 300
    //         },
    //         {
    //             root: {
    //                 userRootId: 'root2',
    //                 libraryId: 'library2'
    //             },
    //             rfidId: '67890',
    //             isbn: '978-0-13-110362-7',
    //             title: 'Outro Livro',
    //             subtitle: 'Outro Subtítulo',
    //             author: 'Outro Autor',
    //             sinopse: 'Sinopse de outro livro.',
    //             gender: 'Não-ficção',
    //             language: 'Inglês',
    //             urlImage: 'http://exemplo.com/outraimagem.jpg',
    //             publishers: ['Outra Editora'],
    //             publishDate: '2023-06-15',
    //             physicalDimensions: '21x14 cm',
    //             publishPlaces: ['Outra Cidade'],
    //             numberOfPages: 150
    //         }
    //     ];
    //     return books.find(book => book.rfidId === rfidId);
    // };
});