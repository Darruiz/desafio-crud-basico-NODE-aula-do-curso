const db = require('../../config/db');

// Adicionar uma nova task
exports.add = async (req, res) => {
    const { title, description } = req.body;
    try {
        const query = `
            INSERT INTO tasks SET 
                title = ?, 
                description = ?, 
                created_at = NOW(), 
                updated_at = NOW()
        `;
        const result = await db.execute(query, [title, description]);
        res.status(201).json({ message: 'Task adicionada com sucesso!', taskId: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar task:', error);
        res.status(500).json({ error: 'Erro ao adicionar task' });
    }
};

// Deletar uma task pelo ID
exports.del = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM tasks WHERE id = ?';
        const result = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
};

// Atualizar uma task pelo ID
exports.upt = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        return res.status(400).json({ error: 'At least one of title or description must be provided.' });
    }

    try {
        const query = `
            UPDATE tasks 
            SET title = COALESCE(?, title), 
                description = COALESCE(?, description), 
                updated_at = NOW() 
            WHERE id = ?
        `;
        const result = await db.execute(query, [title, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.status(200).json({ message: 'Task updated successfully!' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
};

// Buscar todas as tasks ou filtrar pelo título e descrição
exports.get = async (req, res) => {
    const { title, description } = req.query;

    try {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];

        if (title) {
            query += ' AND title LIKE ?';
            params.push(`%${title}%`);
        }

        if (description) {
            query += ' AND description LIKE ?';
            params.push(`%${description}%`);
        }

        const tasks = await db.execute(query, params);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};