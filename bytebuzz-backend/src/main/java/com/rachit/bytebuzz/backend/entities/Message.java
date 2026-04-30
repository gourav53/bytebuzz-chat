package com.rachit.bytebuzz.backend.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Message
{
    private String sender;
    private String content;
    private OffsetDateTime timeStamp;
-
    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timeStamp = OffsetDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
}
