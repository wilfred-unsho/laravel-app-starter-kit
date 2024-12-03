<?php

return [
    'min_length' => 8,
    'require_uppercase' => true,
    'require_numeric' => true,
    'require_special_char' => true,
    'password_history' => 3, // Number of previous passwords to remember
    'max_age_days' => 90,    // Password expiration in days
    'prevent_common_passwords' => true,
];
