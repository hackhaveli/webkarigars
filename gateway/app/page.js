'use client';

export default function Home() {
  const templates = [
    { name: 'E-Commerce Elane', path: '/ecommerce/elane', category: 'E-Commerce' },
    { name: 'Saloon fA', path: '/saloon/fa', category: 'Lifestyle' },
  ];

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1e2e, #000)',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.05em' }}>
        Web<span style={{ color: '#6366f1' }}>Karigars</span>
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Select a template to preview
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        width: '100%'
      }}>
        {templates.map((t) => (
          <a
            key={t.path}
            href={t.path}
            style={{
              padding: '2rem',
              borderRadius: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 'bold', textTransform: 'uppercase' }}>{t.category}</span>
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>{t.name}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Click to view template →</p>
          </a>
        ))}
      </div>
    </main>
  );
}
