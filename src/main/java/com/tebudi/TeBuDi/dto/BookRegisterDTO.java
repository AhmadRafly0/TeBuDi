package com.tebudi.TeBuDi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookRegisterDTO {

    @NotBlank(message = "ID Book tidak boleh kosong")
    @Size(min = 1, max = 50, message = "ID Book harus antara 1 - 50 karakter")
    private String id;

    @NotNull(message = "Kategori tidak boleh kosong")
    private int category;

    @NotBlank(message = "Judul tidak boleh kosong")
    private String title;

    @NotBlank(message = "Penulis tidak boleh kosong")
    @Size(min = 1, max = 100, message = "Penulis harus antara 1 - 100 karakter")
    private String author;

    private String description;

    private String coverURL;

    @NotBlank(message = "URL File tidak boleh kosong")
    private String fileURL;

    @NotNull(message = "Is Premium tidak boleh kosong")
    private Boolean isPremium;
}
