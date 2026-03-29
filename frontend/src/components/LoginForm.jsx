

export default function LoginForm({ form, loading, onChange, onSubmit }) {
  return (
    <>
    
      <div className="form-sub">Login dulu kiddo</div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <div className="input-wrap">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="input-wrap">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={onChange}
          />
        </div>
      </div>

      <button className="btn-submit" onClick={onSubmit} disabled={loading}>
        {loading ? 'Memproses...' : 'Masuk →'}
      </button>
    </>
  )
}
