// All students
let members = [];

// DOM Elements
const form = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const tierSelect = document.getElementById('tier');
const dashboard = document.getElementById('dashboard');
const registerSection = document.getElementById('register-section');
const totalPoolEl = document.getElementById('total-pool');
const weeklyInterestEl = document.getElementById('weekly-interest');
const memberCountEl = document.getElementById('member-count');
const membersBody = document.getElementById('members-body');

// Tier amounts
const tiers = {
  1: { amount: 10000, interest: 5 },
  2: { amount: 20000, interest: 10 },
  3: { amount: 30000, interest: 20 }
};

// Format money
function formatMoney(amount) {
  return '₦' + amount.toLocaleString();
}

// Recalculate everything
function updateDashboard() {
  const totalPool = members.reduce((sum, m) => sum + m.contribution, 0);
  const weeklyInterest = totalPool * 0.20;
  const perMemberInterest = members.map(m => {
    const share = totalPool === 0 ? 0 : m.contribution / totalPool;
    return weeklyInterest * share;
  });

  totalPoolEl.textContent = formatMoney(totalPool);
  weeklyInterestEl.textContent = formatMoney(weeklyInterest);
  memberCountEl.textContent = members.length;

  membersBody.innerHTML = '';
  members.forEach((member, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${member.name}</td>
      <td>Tier ${member.tier}</td>
      <td>${formatMoney(member.contribution)}</td>
      <td>${formatMoney(perMemberInterest[i])}</td>
      <td>
        <button onclick="openWithdraw(${i})">Withdraw</button>
        <button onclick="removeMember(${i})" style="background:#e74c3c;">Remove</button>
      </td>
    `;
    membersBody.appendChild(row);
  });

  if (members.length > 0) {
    dashboard.classList.remove('hidden');
  }
}

// Register
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const tier = parseInt(tierSelect.value);
  if (!name || !tier) return;

  members.push({ name, tier, contribution: tiers[tier].amount });
  nameInput.value = '';
  tierSelect.value = '';
  updateDashboard();
});

// Remove
function removeMember(index) {
  if (confirm('Remove this student?')) {
    members.splice(index, 1);
    updateDashboard();
  }
}

// Withdraw
let currentIndex = -1;
const modal = document.getElementById('modal');
const availableEl = document.getElementById('available-amount');
const withdrawInput = document.getElementById('withdraw-amount');

function openWithdraw(index) {
  currentIndex = index;
  availableEl.textContent = formatMoney(members[index].contribution);
  withdrawInput.value = '';
  modal.classList.remove('hidden');
}

document.getElementById('cancel-withdraw').onclick = () => {
  modal.classList.add('hidden');
};

document.getElementById('confirm-withdraw').onclick = () => {
  const amount = parseFloat(withdrawInput.value);
  if (isNaN(amount) || amount <= 0 || amount > members[currentIndex].contribution) {
    alert('Invalid amount!');
    return;
  }
  members[currentIndex].contribution -= amount;
  if (members[currentIndex].contribution === 0) members.splice(currentIndex, 1);
  modal.classList.add('hidden');
  updateDashboard();
};