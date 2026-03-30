# Create Simulator 
set ns [new Simulator] 

# Trace files 
set tf [open out.tr w] 
$ns trace-all $tf 
set nf [open out.nam w] 
$ns namtrace-all $nf 

# Create nodes 
set n0 [$ns node] 
set n1 [$ns node] 
set n2 [$ns node] 
set n3 [$ns node] 

# Create links 
$ns duplex-link $n0 $n1 1Mb 10ms DropTail 
$ns duplex-link $n1 $n2 1Mb 10ms DropTail 
$ns duplex-link $n2 $n3 1Mb 10ms DropTail 

# TCP Agent 
set tcp [new Agent/TCP] 
$ns attach-agent $n0 $tcp 

# TCP Sink 
set sink [new Agent/TCPSink] 
$ns attach-agent $n3 $sink 

# Connect agents 
$ns connect $tcp $sink 

# FTP Application 
set ftp [new Application/FTP] 
$ftp attach-agent $tcp 

# Start & Stop 
$ns at 1.0 "$ftp start" 
$ns at 4.0 "$ftp stop" 

# Finish procedure 
proc finish {} { 
global ns tf nf 
$ns flush-trace 
close $tf 
close $nf 
exec nam out.nam & 
exit 0 
} 
$ns at 5.0 "finish" 

# Run simulation 
$ns run