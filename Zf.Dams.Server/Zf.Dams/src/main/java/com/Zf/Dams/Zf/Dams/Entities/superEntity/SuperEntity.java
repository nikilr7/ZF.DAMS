package com.Zf.Dams.Zf.Dams.Entities.superEntity;

import jakarta.persistence.*;
@MappedSuperclass
public class SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}

