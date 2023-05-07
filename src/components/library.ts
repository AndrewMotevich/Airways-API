import { app, hash } from './authorization';
import express from 'express';
import { client } from './authorization';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AddToSetOperators } from 'mongodb';
import { PullOperator } from 'mongodb';

function library() {
    const corsOptions = {
        origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://127.0.0.1:5500', 'https://podcast-deploy.vercel.app'],
        methods: 'GET,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['X-admin-pass', 'X-hash-pass', 'Library', 'Content-Type'],
        credentials: true,
        maxAge: 86400,
    };
    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(cookieParser());
    function checkStatePlaylists(playlist: string) {
        const checkLikedPodcasts = playlist != 'likedPodcasts';
        const checkSubscribedPodcasts = playlist != 'subscribedPodcasts';
        if (checkSubscribedPodcasts && checkLikedPodcasts) return true;
        else return false;
    }

    app.get('/allPlaylists', async function (req, res) {
        if (req.headers['x-admin-pass'] === 'root') {
            const usersArray = await client.db('podcastLibrary').collection('library').find().toArray();
            res.end(JSON.stringify(usersArray));
        } else {
            res.status(500);
            res.end('!!!Get out intruder!!!');
        }
    });

    app.get('/userLibrary/:email', async function (req, res) {
        if (
            req.cookies['is-logged-in'] !== undefined &&
            req.cookies['email'] === hash(req.params.email)
        ) {
        const userLibrary = await client
            .db('podcastLibrary')
            .collection('library')
            .findOne({ email: `${req.params.email}` });
        res.end(JSON.stringify(userLibrary));
        } else
        {
            res.status(404);
            res.end('You are not logged in or incorrect email');
        }
    });

    app.patch('/addNewPlaylist/:email/:playlistName', async function (req, res) {
        if (
            req.cookies['is-logged-in'] !== undefined &&
            req.cookies['email'] === hash(req.params.email) &&
            checkStatePlaylists(req.params.playlistName)
        ) {
            const playlistName = req.params.playlistName;
            await client
                .db('podcastLibrary')
                .collection('library')
                .updateOne({ email: `${req.params.email}` }, { $set: { [playlistName]: [] } });
            res.end(`Playlist ${req.params.playlistName} was added`);
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect email');
        }
    });

    app.patch('/renamePlaylist/:email/:playlistName/:newPlaylistName', async function (req, res) {
        if (
            req.cookies['is-logged-in'] === 'true' &&
            req.cookies['email'] === hash(req.params.email) &&
            checkStatePlaylists(req.params.playlistName)
        ) {
            const playlistName = req.params.playlistName;
            await client
                .db('podcastLibrary')
                .collection('library')
                .updateMany(
                    { email: `${req.params.email}` },
                    { $rename: { [playlistName]: `${req.params.newPlaylistName}` } }
                );
            res.end(`Playlist ${req.params.playlistName} was renamed to ${req.params.newPlaylistName}`);
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect email');
        }
    });

    app.post('/addItemToPlaylist/:email/:playlistName/:itemId', async function (req, res) {
        if (req.cookies['is-logged-in'] === 'true' && req.cookies['email'] === hash(req.params.email)) {
            const playlistName = req.params.playlistName;
            const itemIdObj = { id: Number(req.params.itemId) };
            await client
                .db('podcastLibrary')
                .collection('library')
                .updateMany({ email: `${req.params.email}` }, {
                    $addToSet: { [playlistName]: itemIdObj },
                } as AddToSetOperators<Document>);
            res.end(`Item with id:${req.params.itemId} was added`);
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect email');
        }
    });

    app.delete('/removeItemFromPlaylist/:email/:playlistName/:itemId', async function (req, res) {
        if (req.cookies['is-logged-in'] === 'true' && req.cookies['email'] === hash(req.params.email)) {
            const playlistName = req.params.playlistName;
            const itemIdObj = { id: Number(req.params.itemId) };
            await client
                .db('podcastLibrary')
                .collection('library')
                .updateMany({ email: `${req.params.email}` }, {
                    $pull: { [playlistName]: itemIdObj },
                } as PullOperator<Document>);
            res.end(`Item with id:${req.params.itemId} was deleted`);
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect email');
        }
    });

    app.delete('/removePlaylist/:email/:playlistName', async function (req, res) {
        if (
            req.cookies['is-logged-in'] === 'true' &&
            req.cookies['email'] === hash(req.params.email) &&
            checkStatePlaylists(req.params.playlistName)
        ) {
            const playlistName = req.params.playlistName;
            await client
                .db('podcastLibrary')
                .collection('library')
                .updateMany({ email: `${req.params.email}` }, { $unset: { [playlistName]: '' } });
            res.end(`Playlist ${req.params.playlistName} was deleted`);
        } else {
            res.status(500);
            res.end('You are not logged in or incorrect email');
        }
    });
}

export default library;
