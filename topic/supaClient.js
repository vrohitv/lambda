var supaBaseUrl = ""
var supaBaseAPIKey = ""
const { createClient } = require('@supabase/supabase-js');

exports.supabase = createClient(supaBaseUrl, supaBaseAPIKey)
