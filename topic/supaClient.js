var supaBaseUrl = "https://ubimrawvzdznjyqqshaf.supabase.co"
var supaBaseAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaW1yYXd2emR6bmp5cXFzaGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNzI3OTksImV4cCI6MjAzNzk0ODc5OX0.vHSMo4EO_tcauDHvzyrEnB-pOs0O_Nbp1DsGYKVFb2E"
const { createClient } = require('@supabase/supabase-js');

exports.supabase = createClient(supaBaseUrl, supaBaseAPIKey)