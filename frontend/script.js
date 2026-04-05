function switchTab(tab, e) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('forgotForm').classList.add('hidden');
}

function showForgot() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('forgotForm').classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
}

function showLogin() {
  document.getElementById('forgotForm').classList.add('hidden');
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  document.querySelectorAll('.tab')[0].classList.add('active');
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `message ${type}`;
}

async function login() {
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) {
    showMsg('loginMsg', 'Please fill all fields', 'error');
    return;
  }
  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const role = data.user.user_metadata?.role;
      showMsg('loginMsg', 'Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = role === 'teacher' ? 'teacher/index.html' : 'student/index.html';
      }, 1000);
    } else {
      showMsg('loginMsg', data.detail || 'Login failed', 'error');
    }
  } catch(e) {
    showMsg('loginMsg', 'Server error. Is backend running?', 'error');
  }
}

async function signup() {
  const full_name  = document.getElementById('signupName').value.trim();
  const student_id = document.getElementById('signupStudentId').value.trim();
  const email      = document.getElementById('signupEmail').value.trim();
  const password   = document.getElementById('signupPassword').value;

  if (!full_name || !student_id || !email || !password) {
    showMsg('signupMsg', 'Please fill all fields', 'error');
    return;
  }
  if (password.length < 6) {
    showMsg('signupMsg', 'Password must be at least 6 characters', 'error');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name,
        role: 'student',
        student_id
      })
    });
    const data = await res.json();
    if (res.ok) {
      showMsg('signupMsg', 'Account created! Please login.', 'success');
    } else {
      showMsg('signupMsg', data.detail || 'Signup failed', 'error');
    }
  } catch(e) {
    showMsg('signupMsg', 'Server error.', 'error');
  }
}

async function forgotPassword() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) {
    showMsg('forgotMsg', 'Please enter your email', 'error');
    return;
  }
  try {
    const res = await fetch(`${API}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      showMsg('forgotMsg', 'Reset link sent! Check your email.', 'success');
    } else {
      showMsg('forgotMsg', 'Something went wrong.', 'error');
    }
  } catch(e) {
    showMsg('forgotMsg', 'Server error.', 'error');
  }
}