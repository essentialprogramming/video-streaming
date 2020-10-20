package com.util.enums;

public enum EmailProvider {

    MANDRILL(1),
    SENDGRID(2);

    public final Integer value;

    EmailProvider(Integer value) {
        this.value = value;
    }
}
