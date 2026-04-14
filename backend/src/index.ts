import 'dotenv/config';
import express from 'express';
import healthRoutes from './routes/healthRoutes';
import sheetsRoutes from './routes/sheetsRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/sheets', sheetsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));