/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/paERP",
        destination: "https://synkion.com/ws/api/inWebRestAPI/GetData/paERP",
      },
      {
        source: "/api/paERP/update",
        destination: "https://synkion.com/ws/api/inWebRestAPI/setdata/updatepa",
      },
      {
        source: '/api/updateCard',
        destination: 'https://synkion.com/ws/api/inWebRestAPI/setdata/updatepa',
      },
    ];
  },
};

module.exports = nextConfig;
