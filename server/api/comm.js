
export default async (req, res) => {
    return $fetch('http://localhost:9092/api/comm/initData', { method: 'get' });
}
