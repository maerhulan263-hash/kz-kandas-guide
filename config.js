/**
 * ============================================================
 * Supabase 连接配置
 * ============================================================
 * 这两个值都是"公开"的，可以放心提交到 GitHub 仓库：
 * - SUPABASE_URL: 你的项目地址
 * - SUPABASE_ANON_KEY: 公开密钥（Publishable key），
 *   配合数据库的行级安全策略（RLS）使用，是安全的。
 *
 * 千万不要把 "service_role" / "secret" 开头的密钥放在这里，
 * 那个密钥拥有绕过所有安全策略的权限，只能用在服务器端。
 * ============================================================
 */

const SUPABASE_URL = "https://cjsvvggwkrivlzhmvbmw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YGICmhyInfWmxxMJ_2UF-A_NavD2D94";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
