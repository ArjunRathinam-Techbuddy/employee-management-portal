package com.employeeportal.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * Generates a temporary password meeting the spec's complexity rule:
 * min 8 chars, at least 1 uppercase, 1 number, 1 special char.
 * Used when an admin creates an employee + linked user account in one step.
 * The "welcome email" is logged (console) rather than actually sent — no
 * mail infra in scope per the assignment's bonus section.
 */
@Component
public class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijkmnpqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SPECIAL = "!@#$%^&*";
    private static final String ALL = UPPER + LOWER + DIGITS + SPECIAL;

    private final SecureRandom random = new SecureRandom();

    public String generate() {
        StringBuilder sb = new StringBuilder();
        sb.append(UPPER.charAt(random.nextInt(UPPER.length())));
        sb.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        sb.append(SPECIAL.charAt(random.nextInt(SPECIAL.length())));
        for (int i = 0; i < 7; i++) {
            sb.append(ALL.charAt(random.nextInt(ALL.length())));
        }
        // Shuffle so the guaranteed chars aren't always in the same position
        char[] chars = sb.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char tmp = chars[i]; chars[i] = chars[j]; chars[j] = tmp;
        }
        return new String(chars);
    }
}
