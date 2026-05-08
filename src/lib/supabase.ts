import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// === 工人 ===
export async function getWorkers() {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('is_active', true)
    .order('worker_code');
  if (error) console.error(error);
  return data || [];
}

// === 打卡 ===
export async function clockIn(workerId: number, location: string, lat?: number, lng?: number) {
  const { data, error } = await supabase
    .from('clock_records')
    .insert([{
      worker_id: workerId,
      type: 'clock_in',
      location,
      latitude: lat,
      longitude: lng,
    }])
    .select();
  if (error) console.error(error);
  return data;
}

export async function clockOut(workerId: number, location: string, lat?: number, lng?: number) {
  const { data, error } = await supabase
    .from('clock_records')
    .insert([{
      worker_id: workerId,
      type: 'clock_out',
      location,
      latitude: lat,
      longitude: lng,
    }])
    .select();
  if (error) console.error(error);
  return data;
}

export async function getTodayClockRecords(workerId?: number) {
  const today = new Date().toISOString().split('T')[0];
  let query = supabase
    .from('clock_records')
    .select('*, workers(*)')
    .gte('clock_time', today + 'T00:00:00')
    .order('clock_time', { ascending: false });

  if (workerId) query = query.eq('worker_id', workerId);

  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}

export async function getMonthClockRecords(workerId?: number) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  let query = supabase
    .from('clock_records')
    .select('*, workers(*)')
    .gte('clock_time', monthStart)
    .order('clock_time', { ascending: false });

  if (workerId) query = query.eq('worker_id', workerId);

  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}

// === 案件 ===
export async function getCases() {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function createCase(caseData: any) {
  const code = `C-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
  const { data, error } = await supabase
    .from('cases')
    .insert([{ ...caseData, case_code: code }])
    .select();
  if (error) console.error(error);
  return data;
}

export async function updateCaseStatus(caseId: number, status: string) {
  const { data, error } = await supabase
    .from('cases')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', caseId)
    .select();
  if (error) console.error(error);
  return data;
}

// === 客戶 ===
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('total_amount', { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function createCustomer(customer: any) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select();
  if (error) console.error(error);
  return data;
}

// === 預約 ===
export async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function createBooking(booking: any) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select();
  if (error) console.error(error);
  return data;
}

export async function updateBookingStatus(bookingId: number, status: string) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select();
  if (error) console.error(error);
  return data;
}

// === 財務 ===
export async function getFinanceRecords(month?: string) {
  let query = supabase
    .from('finance_records')
    .select('*')
    .order('record_date', { ascending: false });

  if (month) {
    const [y, m] = month.split('-');
    const start = `${y}-${m}-01`;
    const next = new Date(parseInt(y), parseInt(m), 1).toISOString().split('T')[0];
    query = query.gte('record_date', start).lt('record_date', next);
  }

  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}

export async function createFinanceRecord(record: any) {
  const { data, error } = await supabase
    .from('finance_records')
    .insert([record])
    .select();
  if (error) console.error(error);
  return data;
}

// === 車輛 ===
export async function getVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, workers(name)')
    .order('plate');
  if (error) console.error(error);
  return data || [];
}

// === 服務地區 ===
export async function getServiceAreas() {
  const { data, error } = await supabase
    .from('service_areas')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) console.error(error);
  return data || [];
}

// === 派工 ===
export async function getJobs(date?: string) {
  let query = supabase
    .from('jobs')
    .select('*, cases(*), workers(name)')
    .order('job_date', { ascending: false });

  if (date) query = query.eq('job_date', date);

  const { data, error } = await query;
  if (error) console.error(error);
  return data || [];
}
