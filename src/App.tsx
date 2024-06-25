import { useState } from 'react';
import { ActionSheet } from './components/ActionSheet';

// Styles
import './App.css'

function App () {
    const [showActionSheet, setShowActionSheet] = useState(false);

    return (
        <main>
            <button onClick={() => setShowActionSheet(true)}>Show ActionSheet</button>

            <ActionSheet show={showActionSheet}>
                <h1>Hi there!</h1>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, ipsum. Praesentium ab molestias cupiditate maxime quod? Cumque similique tempore aperiam? Laboriosam sed dolorum maxime placeat nemo doloribus odit ut ex.</p>
                <button onClick={() => setShowActionSheet(false)}>Close</button>
            </ActionSheet>
        </main>
    )
}

export default App
