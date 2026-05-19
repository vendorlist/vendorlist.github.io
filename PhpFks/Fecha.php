<?php

    function formatearFecha($fecha){
        return date('d/m g:i a', strtotime($fecha));
    }
    
?>